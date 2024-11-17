import {
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransportDto } from './dto/create-transport.dto';
import { UpdateTransportDto } from './dto/update-transport.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transport } from '../entities/transport/transport.entity';
import { Repository } from 'typeorm';
import { Seat } from '../entities/seat/seat.entity';
import { TransportSeats } from '../entities/transport/transport.seats';

@Injectable()
export class TransportService {
  private logger: Logger = new Logger(TransportService.name);

  constructor(
    @InjectRepository(Transport)
    private readonly transportRepository: Repository<Transport>,
    @InjectRepository(TransportSeats)
    private readonly transportSeatsRepository: Repository<TransportSeats>,
    @InjectRepository(Seat) private readonly seatRepository: Repository<Seat>,
  ) {
  }

  async create(createTransportDto: CreateTransportDto) {
    try {
      const transport = this.transportRepository.create({
        name: createTransportDto.transport_name,
        description: createTransportDto.transport_description,
        capacity: createTransportDto.capacity,
      });
      const seats: any[] = [];
      for (let i = 1; i <= createTransportDto.capacity; i++) {
        const seat = new Seat();
        seat.title = `Seat - ${i}`;
        seats.push(seat);
      }
      const transportSeats = this.transportSeatsRepository.create({
        name: transport.name,
        description: transport.description,
        capacity: transport.capacity,
        seats: seats,
      });
      await this.transportSeatsRepository.save(transportSeats);
      return transport;
    } catch (err) {
      this.logger.error(err.message, {
        statusCode: err.status,
        stack: err.stack,
      });
      throw new HttpException(err.message, err.status);
    }
  }

  async findAll() {
    return await this.transportRepository.find();
  }

  async findOne(id: number) {
    return await this.transportSeatsRepository
      .createQueryBuilder('transport')
      .where(`transport.id = ${id}`)
      .leftJoinAndSelect('transport.seats', 'seats')
      .getOne();
  }

  async update(id: number, updateTransportDto: UpdateTransportDto) {
    try {
      const foundTransport = await this.transportRepository.findOne({
        where: { id },
      });
      if (!foundTransport) throw new NotFoundException('Transport not found');
      foundTransport.name = updateTransportDto.transport_name;
      foundTransport.description = updateTransportDto.transport_description;
      foundTransport.capacity = updateTransportDto.capacity;
      const updatedTransport =
        await this.transportRepository.save(foundTransport);
      return {
        success: true,
        message: 'Updated transport successfully.',
        data: updatedTransport,
      };
    } catch (err) {
      this.logger.error(err.message, {
        statusCode: err.status,
        stack: err.stack,
      });
      throw new HttpException(err.message, err.status);
    }
  }

  async remove(id: number) {
    try {
      const foundTransport = await this.transportRepository
        .createQueryBuilder('transport')
        .where('transport.id = :id', { id })
        .getOne();
      if (!foundTransport) throw new NotFoundException('Transport not found');
      await this.transportRepository.softDelete(foundTransport.id);
      await this.seatRepository
        .createQueryBuilder('seats')
        .softDelete()
        .where('seats.transportId = :id', { id })
        .execute();
      return {
        success: true,
        message: 'Removed',
      };
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
