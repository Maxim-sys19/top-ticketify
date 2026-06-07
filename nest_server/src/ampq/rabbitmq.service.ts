import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitmqService implements OnModuleDestroy {
  private conn: amqp.ChannelModel | null;
  private connecting: Promise<void> | null = null;
  private readonly logger = new Logger(RabbitmqService.name);
  constructor(private readonly configService: ConfigService) {}
  async connect() {
    if (this.conn) return;
    this.connecting = (async () => {
      try {
        this.conn = await amqp.connect(
          this.configService.get<string>('amq_connection'),
        );
        this.conn.on('error', (err) => {
          this.logger.error('AMQP connections error :', err);
        });
        this.conn.on('close', () => {
          this.logger.log('AMQP connection close');
          this.conn = null;
        });
        this.logger.log('AMQP connected');
      } catch (err) {
        this.logger.error(`AMQP connection failed:`, err);
        this.conn = null;
        throw err;
      }
    })();
    try {
      await this.connecting;
    } finally {
      this.connecting = null;
    }
  }
  async getConnection() {
    return this.conn;
  }
  async createChannel() {
    await this.connect();

    if (!this.conn) {
      throw new Error('Connection is null');
    }

    const ch = await this.conn.createChannel();

    ch.on('error', (err) => {
      this.logger.error('AMQP channel error', err as any);
    });

    ch.on('close', () => {
      this.logger.warn('AMQP channel closed');
    });

    return ch;
  }
  async assertQueueWithChannel(
    ch: amqp.Channel,
    queueName: string,
    options?: amqp.Options.AssertQueue,
  ) {
    return ch.assertQueue(queueName, options);
  }
  async assertExchangeWithChannel(
    ch: amqp.Channel,
    exchangeName: string,
    type: string = 'direct',
    options?: amqp.Options.AssertExchange,
  ) {
    return ch.assertExchange(exchangeName, type, options);
  }
  async bindQueueWithChannel(
    ch: amqp.Channel,
    queueName: string,
    exchangeName: string,
    routingKey: string,
  ) {
    return ch.bindQueue(queueName, exchangeName, routingKey);
  }
  async publishToQueueWithChannel(
    ch: amqp.Channel,
    queueName: string,
    message: any,
    options?: amqp.Options.Publish,
  ) {
    const buffer = Buffer.from(JSON.stringify(message));
    return ch.sendToQueue(queueName, buffer, options);
  }
  async publishToExchange(
    ch: amqp.Channel,
    exchangeName: string,
    routingKey: string,
    message: any,
    options?: amqp.Options.Publish,
  ) {
    const buffer = Buffer.from(JSON.stringify(message));
    return ch.publish(exchangeName, routingKey, buffer, options);
  }
  async consume(
    ch: amqp.Channel,
    queueName: string,
    onMessage: (msg: amqp.ConsumeMessage) => void,
    options?: amqp.Options.Consume & { prefetch: number },
  ) {
    try {
      return ch.consume(queueName, onMessage, options);
    } catch (err) {
      throw err;
    }
  }
  async ack(ch: amqp.Channel, msg: amqp.ConsumeMessage) {
    return ch.ack(msg);
  }
  async nack(ch: amqp.Channel, msg: amqp.ConsumeMessage, requeue = false) {
    return ch.nack(msg, false, requeue);
  }
  async onModuleDestroy() {
    try {
      if (this.conn) await this.conn.close();
      console.log('AMQP connections closed with success');
    } catch (err) {
      console.log('AMQP connections closed with error :', err);
      throw err;
    }
  }
}
