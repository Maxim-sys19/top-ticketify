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
import { flattenValidationError } from './validationPipe/flattenValidationError';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedError = flattenValidationError(errors);
        return new BadRequestException({
          message: 'Validation error',
          errors: formattedError,
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
