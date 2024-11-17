import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        config: {
          host: config.get('redis_host'),
          port: config.get('redis_port'),
        },
      }),
    }),
  ],
  providers: [],
  exports: [RedisModule],
})
export class MyRedisModule {
}
