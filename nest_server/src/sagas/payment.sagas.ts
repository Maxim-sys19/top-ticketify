import { ofType, Saga } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { EMPTY, from, mergeMap, Observable, tap } from 'rxjs';
import { OpenPaymentAccessCommand } from 'src/payment/application/commands/open.payment.access.command';
import { BookingExpiredEvent } from 'src/booking/domain/events/booking.expired.event';
import { RevokePaymentCommand } from 'src/payment/application/commands/revoke.payment.command';
import { SagasStateStore } from 'src/sagas/sagas.state.store';
import { PaymentCreatedEvent } from 'src/payment/domain/events/payment.created.event';

@Injectable()
export class PaymentSagas {
  constructor(private readonly sagasStateStore: SagasStateStore) {}
  @Saga()
  openPaymentAccess = ($events: Observable<any>) => {
    return $events.pipe(
      ofType(),
      mergeMap((event: any) => {
        return from(
          this.sagasStateStore.set(
            { bookingId: event.bookingId },
            `payment:${event.bookingId}`,
            900,
          ),
        ).pipe(
          mergeMap(() => [
            new OpenPaymentAccessCommand(event.bookingId, event.userId),
          ]),
        );
      }),
    );
  };
  @Saga()
  setPaymentIntentId = ($events: Observable<any>) => {
    return $events.pipe(
      ofType(PaymentCreatedEvent),
      mergeMap((event: PaymentCreatedEvent) => {
        return from(
          this.sagasStateStore.update(`payment:${event.bookingId}`, {
            paymentIntentId: event.paymentIntentId,
          }),
        );
      }),
      mergeMap(() => EMPTY),
    );
  };
  @Saga()
  revokePaymentAccess = ($events: Observable<any>) => {
    return $events.pipe(
      ofType(BookingExpiredEvent),
      mergeMap((event: BookingExpiredEvent) =>
        from(this.sagasStateStore.get(`payment:${event.id}`)).pipe(
          mergeMap((state) => {
            console.log('STATE :', state);
            if (!state?.paymentIntentId) return EMPTY;
            return from([new RevokePaymentCommand(state.paymentIntentId)]).pipe(
              tap(async () =>
                this.sagasStateStore.delete(`payment:${state.bookingId}`),
              ),
            );
          }),
        ),
      ),
    );
  };
}
