import { BookingRepository } from '../../domain/repositories/booking.repository';
import { CreateBookingDto } from '../dto/create.booking.dto';
import { Booking } from '../../domain/booking';
import { BookingPropTypes } from '../../domain/types/booking.prop.types';

export class CreateBookingUseCase {
  constructor(private readonly bookingRepository: BookingRepository) {}
  async execute(id: string, dto: CreateBookingDto): Promise<any> {
    try {
      const inputDto: BookingPropTypes = {
        userId: id,
        routeId: dto.routeId,
        companyId: dto.companyId,
        transportId: dto.transportId,
        seatId: dto.seatId,
        bookingTime: new Date(dto.bookingTime),
      };
      const booking = Booking.create(inputDto);
      booking.confirm();
      return await this.bookingRepository
        .save(booking)
        .then(
          (result) =>
            result && {
              success: true,
              message: 'Booking successfully created',
            },
        )
        .catch((err) => console.log('Booking created failed :', err));
    } catch (error) {
      console.log('CreateBookingUseCase err :', error);
    }
  }
}
