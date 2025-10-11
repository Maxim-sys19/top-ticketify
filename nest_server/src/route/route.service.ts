import {
  BadRequestException, HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {CreateRouteDto} from './dto/create-route.dto';
import {UpdateRouteDto} from './dto/update-route.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {QueryFailedError, Repository} from 'typeorm';
import {Route} from '../entities/route/route.entity';
import {PaginationParams} from 'src/decorators/pagination';
import {BulkDeleteDto} from '../dto/bulk-delete.dto';
import {GoogleMapsService} from "src/google-maps/google-maps.service";
import {Redis} from "ioredis";
import {RedisService} from "@liaoliaots/nestjs-redis";

@Injectable()
export class RouteService {
  private readonly logger = new Logger(RouteService.name);
  private readonly redisClient: Redis
  private readonly TTL: number = 100 * 60
  private cacheKey: string

  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
    private readonly googleMapService: GoogleMapsService,
    private readonly redisService: RedisService
  ) {
    this.redisClient = this.redisService.getOrThrow()
  }

  async create(createRouteDto: CreateRouteDto) {
    try {
      this.cacheKey = `route:${createRouteDto.start.lat}-${createRouteDto.end.lat}`
      console.log('cacheKey create route:', this.cacheKey)
      try {
        const cachedRoute = await this.redisClient.get(this.cacheKey)
        if (cachedRoute) {
          console.log('CachedRoute : ', JSON.parse(cachedRoute))
          return {success: true, data: JSON.parse(cachedRoute)}
        }
      } catch (err) {
        this.logger.warn({
          message: err.message,
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          stack: err.stack
        })
      }
      const existedRoute = await this.routeRepository.findOne({
        where: {
          start_lat: createRouteDto.start.lat,
          start_lng: createRouteDto.start.lng,
          end_lat: createRouteDto.end.lat,
          end_lng: createRouteDto.end.lng,
        },
      })
      console.log('existedRoute : ', existedRoute)
      if (existedRoute) throw new BadRequestException(`Route ${existedRoute.routeName} already exists`)
      const response = await this.googleMapService.getDirections(createRouteDto.start, createRouteDto.end)
      const data = {
        start: createRouteDto.start,
        end: createRouteDto.end,
        routeName: createRouteDto.routeName,
        departureTime: createRouteDto.departureTime,
        arrivalTime: createRouteDto.arrivalTime,
        start_address: response.start_address,
        end_address: response.end_address,
        distance_meters: response.distance_meters,
        duration_seconds: response.duration_seconds
      }
      const route = this.routeRepository.create(data);
      const createdRoute = await this.routeRepository.save(route);
      try {
        await this.redisClient.set(this.cacheKey, JSON.stringify(createdRoute), "EX", this.TTL)
      } catch (err) {
        console.log('Redis Set route Err :', err)
        this.logger.warn({
          message: err.message,
          statusCode: HttpStatus.SERVICE_UNAVAILABLE
        })
      }
      return {success: true, data: createdRoute};
    } catch (err: any) {
      let message = "Internal Server Error"
      message = err.message
      console.log('RouteServiceError :', err)
      throw new HttpException(message, err.status)
    }
  }

  async findAll(params: PaginationParams) {
    try {
      const {page, limit}: PaginationParams = params;
      const routes = this.routeRepository
        .createQueryBuilder('routes')
        .select([
          'routes.id',
          'routes.routeName',
          'routes.start',
          'routes.end',
          'routes.start_address',
          'routes.end_address',
          'routes.distance_meters',
          'routes.duration_seconds',
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
    try {
      const {start, end, arrivalTime, departureTime, routeName} = updateRouteDto;
      const route = await this.routeRepository.findOne({
        where: {
          id
        }
      });
      if (!route) throw new NotFoundException('route not found');
      const response = await this.googleMapService.getDirections(start, end)
      route.routeName = routeName
      route.start = start;
      route.end = end;
      route.arrivalTime = arrivalTime;
      route.departureTime = departureTime;
      route.start_address = response.start_address
      route.end_address = response.end_address
      route.distance_meters = response.distance_meters
      route.duration_seconds = response.duration_seconds
      await this.routeRepository.save(route);
      return {success: true, message: 'route updated successfully!'};
    } catch (err) {
      console.log('RouteService update err: ', err)
      throw new HttpException(err.message, err.status)
    }
  }

  async remove(bulkDeleteDto: BulkDeleteDto) {
    const {ids} = bulkDeleteDto;
    const routes = await this.routeRepository
      .createQueryBuilder()
      .where('id IN (:...ids)', {ids})
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
