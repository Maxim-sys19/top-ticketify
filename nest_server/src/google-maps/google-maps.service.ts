import { CoodinateTypes } from 'src/google-maps/types/get-directions.type';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Redis } from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class GoogleMapsService {
  private readonly redisClient: Redis;
  private logger = new Logger(GoogleMapsService.name);
  private readonly CACHE_TTL = 100 * 6;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.redisClient = this.redisService.getOrThrow();
  }

  async getDirections(start: CoodinateTypes, end: CoodinateTypes) {
    const cacheKey = `directions:${start.lat}-${start.lng}-${end.lat}-${end.lng}`;
    let cached: string | number = null;
    try {
      cached = await this.redisClient.get(cacheKey);
      if (cached) {
        console.log('Cached :');
        return JSON.parse(cached);
      }
    } catch (err) {
      this.logger.warn({
        message: `Redis Get direction error : ${err.message}`,
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      });
    }
    const origin = `${start.lat},${start.lng}`;
    const destination = `${end.lat},${end.lng}`;
    const googleApiKey = this.configService.get<string>('GOOGLE_MAP_API_KEY');
    const params = {
      origin,
      destination,
      key: googleApiKey,
    };
    const url = 'https://maps.googleapis.com/maps/api/directions/json';
    let response: any;
    try {
      response = await firstValueFrom(this.httpService.get(url, { params }));
      console.log('Google Api requested');
      if (response.data.status === 'ZERO_RESULTS') {
        throw new NotFoundException('No routes found from Google Maps');
      }
      if (response.data.status === 'REQUEST_DENIED') {
        throw new InternalServerErrorException(response.data.error_message);
      }
    } catch (err) {
      const status = HttpStatus.SERVICE_UNAVAILABLE;
      this.logger.warn({
        message: err.message,
        statusCode: status,
      });
      if (err instanceof InternalServerErrorException)
        throw new InternalServerErrorException('Internal Server Error');
      else if (err instanceof NotFoundException)
        throw new NotFoundException(err.message);
    }
    const routes = response.data.routes[0];
    const legs = routes?.legs[0];
    const result = {
      start_address: legs.start_address,
      end_address: legs.end_address,
      distance_meters: legs.distance,
      duration_seconds: legs.duration,
    };
    try {
      await this.redisClient.set(
        cacheKey,
        JSON.stringify(result),
        'EX',
        this.CACHE_TTL,
      );
    } catch (err) {
      this.logger.error(`Redis Set direction error : ${err.message}`, {
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        stack: err.stack,
      });
    }
    return result;
  }
}
