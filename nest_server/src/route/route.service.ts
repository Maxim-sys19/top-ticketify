import {
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Redis } from 'ioredis';
import { Route } from '../entities/route/route.entity';
import { PaginationParams } from 'src/decorators/pagination';
import { BulkDeleteDto } from '../dto/bulk-delete.dto';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class RouteService {
  private readonly logger = new Logger(RouteService.name);
  private readonly redisClient: Redis;
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
    private readonly redisService: RedisService,
  ) {
    this.redisClient = this.redisService.getOrThrow();
  }

  async create(createRouteDto: CreateRouteDto) {
    try {
      const route = this.routeRepository.create(createRouteDto);
      const createdRoute = await this.routeRepository.save(route);
      return { success: true, data: createdRoute };
    } catch (err) {
      this.logger.error(err.response.message, {
        statusCode: err.response.statusCode,
        stack: err.stack,
      });
      throw new HttpException(err.response.message, err.response.statusCode);
    }
  }

  async findAll(params: PaginationParams) {
    try {
      const { page, limit }: PaginationParams = params;
      const routes = this.routeRepository
        .createQueryBuilder('routes')
        .select([
          'routes.id',
          'routes.start',
          'routes.end',
          'routes.routeCode',
          'routes.uid',
          'routes.departureTime',
          'routes.arrivalTime',
        ]);
      routes.skip((page - 1) * limit).take(+limit);
      const [data, total] = await routes.getManyAndCount();
      return {
        data,
        meta: {
          totalItems: total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (err) {
      console.log('Error in findAll: ', err);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} route`;
  }

  async update(id: number, updateRouteDto: UpdateRouteDto) {
    const { start, end, arrivalTime, departureTime } = updateRouteDto;
    const route = await this.routeRepository.findOne({ where: { id } });
    if (!route) throw new NotFoundException('route not found');
    route.start = start;
    route.end = end;
    route.arrivalTime = arrivalTime;
    route.departureTime = departureTime;
    await this.routeRepository.save(route);
    return { success: true, message: 'route updated successfully!' };
  }

  async remove(bulkDeleteDto: BulkDeleteDto) {
    const { ids } = bulkDeleteDto;
    const routes = await this.routeRepository
      .createQueryBuilder()
      .where('id IN (:...ids)', { ids })
      .getMany();
    if (routes.length === 0)
      throw new NotFoundException('routes are not found');
    routes.map(async (route) => {
      await this.routeRepository.softDelete(route.id);
    });
    return {
      success: true,
      message: 'routes has been deleted successfully!',
    };
  }
}
