import { Module } from '@nestjs/common';
import { PAYMENT_SERVICE } from 'src/payment/application/ports/outbound/payment-service.port';
import { StripePaymentAdapter } from 'src/payment/infrastucture/stripe/stripe-payment.adapter';
import { RevokePaymentCommandHandler } from 'src/payment/application/commands/handlers/revoke.payment.command.handler';
import { OpenPaymentAccessCommandHandler } from 'src/payment/application/commands/handlers/open.payment.access.command.handler';
import { PaymentSagas } from 'src/sagas/payment.sagas';
import { SagasStateStore } from 'src/sagas/sagas.state.store';
import { BookingBookedConsumer } from './infrastucture/messaging/consumers/booking.booked.consumer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutboxEntity } from 'src/entities/outbox/infrastructure/outbox.entity';
import { OutboxRepositoryImpl } from 'src/outbox/infrastructure/repository/outbox.repository.impl';
import { OutboxRepository } from 'src/outbox/infrastructure/repository/outbox.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OutboxEntity])],
  providers: [
    {
      provide: PAYMENT_SERVICE,
      useClass: StripePaymentAdapter,
    },
    { provide: OutboxRepository, useClass: OutboxRepositoryImpl },
    PaymentSagas,
    BookingBookedConsumer,
    SagasStateStore,
    OpenPaymentAccessCommandHandler,
    RevokePaymentCommandHandler,
  ],
  exports: [],
})
export class PaymentModule {}
