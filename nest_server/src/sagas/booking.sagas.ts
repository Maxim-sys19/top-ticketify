import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { CommandBus, ofType, Saga, UnhandledExceptionBus } from '@nestjs/cqrs';
import {
  catchError,
  EMPTY,
  from,
  mergeMap,
  Observable,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { BookingCreatedEvent } from 'src/booking/domain/events/booking.created.event';
import { BookingExpiredEvent } from 'src/booking/domain/events/booking.expired.event';
import { ReleaseSeatsCommand } from 'src/booking/application/commands/release.seats.command';
import { ScheduleBookingExpirationCommand } from 'src/booking/application/commands/schedule.booking.expiration.command';
import { LockSeatCommand } from 'src/seat/application/commands/lock.seat.command';
import { CancelledBookingCommand } from 'src/booking/application/commands/cancelled.booking.command';

@Injectable()
export class BookingSagas implements OnModuleDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private readonly unhandledExceptionBus: UnhandledExceptionBus,
    private readonly commandBus: CommandBus,
  ) {
    this.unhandledExceptionBus
      .pipe(takeUntil(this.destroy$))
      .subscribe((exceptionInfo) => {
        console.log('Unhandled Exceptions Bus :', exceptionInfo);
      });
  }

  @Saga()
  bookingCreated = (events$: Observable<any>) => {
    return events$.pipe(
      ofType(BookingCreatedEvent),
      mergeMap((event: BookingCreatedEvent) =>
        from(
          this.commandBus.execute(
            new LockSeatCommand(event.seatIds, event.id, event.expiresAt),
          ),
        ).pipe(
          tap((result) => console.log('BCCE :', result)),
          mergeMap((result: any) => {
            if (!result.isSuccess) {
              return from([new CancelledBookingCommand(event.id)]);
            }
            return from([
              new ScheduleBookingExpirationCommand(
                event.id,
                event.expiresAt,
                event.userId,
                event.seatIds,
              ),
            ]);
          }),
          catchError((err) => {
            console.log('BookingCreationSaga Err :', err);
            return EMPTY;
          }),
        ),
      ),
    );
  };
  @Saga()
  bookingExpired = (events$: Observable<any>) => {
    return events$.pipe(
      ofType(BookingExpiredEvent),
      mergeMap((event: BookingExpiredEvent) => [
        new ReleaseSeatsCommand(event.seatIds),
      ]),
    );
  };

  onModuleDestroy(): any {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
