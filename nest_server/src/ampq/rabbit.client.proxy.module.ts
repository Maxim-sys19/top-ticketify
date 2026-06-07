import { Global, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AmpqProviders } from './ampq.providers';
import { RabbitmqService } from 'src/ampq/rabbitmq.service';
import { RabbitTopologyBuilder } from 'src/ampq/infrastructure/rabbit.topology.builder';

@Global()
@Module({
  imports: [ClientsModule.registerAsync(AmpqProviders)],
  providers: [RabbitmqService, RabbitTopologyBuilder],
  exports: [ClientsModule, RabbitmqService],
})
export class RabbitClientProxyModule {}
