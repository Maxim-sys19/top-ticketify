import { Global, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AmpqProviders } from './ampq.providers';
import { RabbitmqService } from 'src/ampq/rabbitmq.service';

@Global()
@Module({
  imports: [ClientsModule.registerAsync(AmpqProviders)],
  providers: [RabbitmqService],
  exports: [ClientsModule, RabbitmqService],
})
export class RabbitClientProxyModule {}
