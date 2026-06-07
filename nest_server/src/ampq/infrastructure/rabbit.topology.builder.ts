import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitmqService } from 'src/ampq/rabbitmq.service';
import { AllTopologies } from 'src/ampq/infrastructure/index';

@Injectable()
export class RabbitTopologyBuilder implements OnModuleInit {
  constructor(private readonly rabbitMqService: RabbitmqService) {}
  async onModuleInit() {
    const ch = await this.rabbitMqService.createChannel();
    for (const topology of AllTopologies) {
      for (const ex of topology.exchanges) {
        await this.rabbitMqService.assertExchangeWithChannel(
          ch,
          ex.name,
          ex.type,
          ex.options,
        );
      }
      for (const queue of topology.queues) {
        await this.rabbitMqService.assertQueueWithChannel(
          ch,
          queue.name,
          queue.options,
        );
        for (const binding of queue.bindings) {
          await this.rabbitMqService.bindQueueWithChannel(
            ch,
            queue.name,
            binding.exchange,
            binding.routingKey,
          );
        }
      }
    }
    await ch.close();
  }
}
