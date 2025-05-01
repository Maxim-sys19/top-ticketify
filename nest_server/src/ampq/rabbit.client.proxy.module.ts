import { Global, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AmpqProviders } from './ampq.providers';

@Global()
@Module({
  imports: [ClientsModule.registerAsync(AmpqProviders)],
  exports: [ClientsModule],
})
export class RabbitClientProxyModule {}
