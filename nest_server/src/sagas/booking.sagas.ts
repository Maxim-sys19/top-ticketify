import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { CommandBus, ofType, Saga, UnhandledExceptionBus } from '@nestjs/cqrs';
import { mergeMap, Observable, of, Subject, takeUntil } from 'rxjs';
import { BookingCreatedEvent } from 'src/booking/domain/events/booking.created.event';
import { BookingExpiredEvent } from 'src/booking/domain/events/booking.expired.event';
import { ReleaseSeatsCommand } from 'src/booking/application/commands/release.seats.command';
import { ScheduleBookingExpirationCommand } from 'src/booking/application/commands/schedule.booking.expiration.command';
import { LockSeatCommand } from 'src/seat/application/commands/lock.seat.command';
import { CancelledBookingCommand } from 'src/booking/application/commands/cancelled.booking.command';
import { SeatLockedEvent } from 'src/seat/domain/events/seat.locked.event';
import { BookingBookedCommand } from 'src/booking/application/commands/booking.booked.command';

@Injectable()
export class BookingSagas implements OnModuleDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private readonly unhandledExceptionBus: UnhandledExceptionBus,
    private readonly commandBus: CommandBus,
  ) {
    this.unhandledExceptionBus
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (exceptionInfo) => {
        const { cause } = exceptionInfo;
        if (cause instanceof LockSeatCommand) {
          await this.commandBus.execute(
            new CancelledBookingCommand(cause.bookingId),
          );
        }
        console.log('Unhandled Exceptions Bus :', exceptionInfo);
      });
  }

  @Saga()
  bookingCreated = (events$: Observable<any>) => {
    return events$.pipe(
      ofType(BookingCreatedEvent),
      mergeMap((event: BookingCreatedEvent) =>
        of(event).pipe(
          mergeMap((evt) => [
            new LockSeatCommand(evt.seatIds, evt.id, evt.expiresAt, evt.userId),
          ]),
        ),
      ),
    );
  };
  @Saga()
  seatLocked = (events$: Observable<any>) => {
    return events$.pipe(
      ofType(SeatLockedEvent),
      mergeMap((event: SeatLockedEvent) => [
        new BookingBookedCommand(event.bookingId, event.userId),
        new ScheduleBookingExpirationCommand(
          event.bookingId,
          event.expiresAt,
          event.userId,
          event.seatIds,
        ),
      ]),
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
