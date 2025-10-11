import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import * as amqp from 'amqplib';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private conn: amqp.Connection | null = null;
  private ch: amqp.Channel;
  private readonly logger = new Logger(RabbitmqService.name);
  constructor(private readonly configService: ConfigService) {}
  async onModuleInit() {
    await this.connect();
  }
  async connect() {
    try {
      this.conn = await amqp.connect(
        this.configService.get<string>('amq_connection'),
      );
      this.ch = await this.conn.createChannel();
      console.log('Connected to AMQP and channel created');
    } catch (err) {
      console.log(`AMQP Error connection :`, err);
      throw err;
    }
  }
  getChannel(): amqp.Channel {
    if (!this.ch) throw new Error('RabbitMq channel is not initialized');
    return this.ch;
  }
  async assertQueue(queueName: string, options?: amqp.Options.AssertQueue) {
    return this.getChannel().assertQueue(queueName, options);
  }
  async assertExchange(
    exchangeName: string,
    type: string = 'direct',
    options?: amqp.Options.AssertExchange,
  ) {
    return this.getChannel().assertExchange(exchangeName, type, options);
  }
  async bindQueue(queueName: string, exchangeName: string, routingKey: string) {
    return this.getChannel().bindQueue(queueName, exchangeName, routingKey);
  }
  async publishToQueue(
    queueName: string,
    message: any,
    options?: amqp.Options.Publish,
  ) {
    const buffer = Buffer.from(JSON.stringify(message));
    return this.getChannel().sendToQueue(queueName, buffer, options);
  }
  async publishToExchange(
    exchangeName: string,
    routingKey: string,
    message: any,
    options?: amqp.Options.Publish,
  ) {
    const buffer = Buffer.from(JSON.stringify(message));
    return this.getChannel().publish(exchangeName, routingKey, buffer, options);
  }
  async consume(
    queueName: string,
    onMessage: (msg: amqp.ConsumeMessage) => void,
    options?: amqp.Options.Consume,
  ) {
    return this.getChannel().consume(queueName, onMessage, options);
  }
  async ack(msg: amqp.ConsumeMessage) {
    return this.getChannel().ack(msg);
  }
  async nack(msg: amqp.ConsumeMessage, requeue = false) {
    return this.getChannel().nack(msg, false, requeue);
  }
  async onModuleDestroy() {
    try {
      await this.ch?.close();
      await this.conn?.close();
      console.log('AMQP connections closed with success');
    } catch (err) {
      console.log('AMQP connections closed with error :', err);
      throw err;
    }
  }
}
