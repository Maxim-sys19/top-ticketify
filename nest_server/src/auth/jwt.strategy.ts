import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt_secret'),
    });
  }

  async validate(payload: any): Promise<any> {
    try {
      // console.log('from payload', payload);
      const isValidJti = await this.redisService.getClient().get(payload.jti);
      // console.log(!isValidJti);
      if (!isValidJti) {
        throw new BadRequestException('Token has been revoked or is invalid');
      }
      return payload.user;
    } catch (err) {
      throw new HttpException(err.response.message, err.status);
    }
  }
}
