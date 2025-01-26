import {
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {CreateTransportDto} from './dto/create-transport.dto';
import {UpdateTransportDto} from './dto/update-transport.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {Transport} from '../entities/transport/transport.entity';
import {Repository} from 'typeorm';
import {Seat} from '../entities/seat/seat.entity';
import {TransportSeats} from '../entities/transport/transport.seats';
import {Company} from '../entities/company/company.entity';
import {TransportCompany} from '../entities/transport/transport.company';
import {SeatTransport} from '../entities/seat/seat.transport';
import {PaginationParams} from '../decorators/pagination';
import {BulkDeleteDto} from 'src/dto/bulk-delete.dto';

@Injectable()
export class TransportService {
  private logger: Logger = new Logger(TransportService.name);

  constructor(
    @InjectRepository(Transport)
    private readonly transportRepository: Repository<Transport>,
    @InjectRepository(TransportSeats)
    private readonly transportSeatsRepository: Repository<TransportSeats>,
    @InjectRepository(Seat) private readonly seatRepository: Repository<Seat>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(TransportCompany)
    private readonly transportCompanyRepository: Repository<TransportCompany>,
  ) {
  }

  async create(createTransportDto: CreateTransportDto) {
    try {
      const company = await this.companyRepository
        .createQueryBuilder('company')
        .where(`company.name = :name`, {
          name: createTransportDto.company_name,
        })
        .getOne();
      if (!company) throw new NotFoundException('company is not found');
      const seats: SeatTransport[] = [];
      for (let i = 1; i <= createTransportDto.capacity; i++) {
        const seat = new SeatTransport();
        seat.title = `Seat of ${createTransportDto.transport_name} - ${i}`;
        seats.push(seat);
      }
      const data = {
        name: createTransportDto.transport_name,
        description: createTransportDto.transport_description,
        capacity: createTransportDto.capacity,
        company,
        seats,
      };

      return this.transportSeatsRepository
        .save(data)
        .then((transport: TransportSeats) => {
          return {
            success: true,
            message: `${transport.name} created successfully`,
          };
        });
    } catch (err) {
      this.logger.error(err.message, {
        statusCode: err.status,
        stack: err.stack,
      });
      throw new HttpException(err.message, err.status);
    }
  }

  async findAll(params: PaginationParams) {
    const {limit = 0, page = 1} = params;
    const transports = this.transportCompanyRepository
      .createQueryBuilder('transport')
      .leftJoinAndSelect('transport.company', 'company')
      .select(['transport', 'company.name']);
    transports.skip((page - 1) * limit).take(+limit);
    const [data, total] = await transports.getManyAndCount();
    return {
      data,
      meta: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
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
        where: {id},
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

  async remove(ids: number[]) {
    try {
      const transports = await this.transportSeatsRepository
        .createQueryBuilder('transport')
        .leftJoinAndSelect('transport.seats', 'seats')
        .select(["transport.id", "transport.name", "seats.id", "seats.title"])
        .where('transport.id IN (:...ids)', { ids })
        .getMany()
      await this.transportSeatsRepository.softRemove(transports);
      return {
        success: true,
        message: 'Removed',
      };
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
