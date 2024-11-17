import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const customErrors = errors.map((error) => {
          return {
            field: error.property,
            message: Object.values(error.constraints || {}).toString(),
          };
        });
        return new BadRequestException({
          message: 'Validation error',
          errors: customErrors,
        });
      },
    }),
  );
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.setBaseViewsDir(join(__dirname, '../src', 'templates'));
  app.setViewEngine('hbs');
  app.enableShutdownHooks();
  app.enableCors({
    origin: config.get('origin_cors'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: '*',
  });
  await app.listen(config.get('port'));
}

bootstrap();
