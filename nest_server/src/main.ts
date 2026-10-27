import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { flattenValidationError } from './validationPipe/flattenValidationError';
import { rabbitMicroservices } from './ampq/rabbit.config';
import { RmqOptions } from '@nestjs/microservices/interfaces/microservice-configuration.interface';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);
  const microservices = await rabbitMicroservices(config);
  microservices.forEach((microservice) => {
    app.connectMicroservice<RmqOptions>(microservice);
  });
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedError = flattenValidationError(errors);
        return new BadRequestException({
          message: 'Validation error',
          errors: formattedError,
        });
      },
      transform: true,
    }),
  );
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  // console.log(__dirname, '..', 'templates');
  app.setBaseViewsDir(join(__dirname, 'templates'));
  app.setViewEngine('hbs');
  // registerHbsPartialRecursive(partialsDir);
  app.enableShutdownHooks();
  app.enableCors({
    origin: config.get('origin_cors'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: '*',
  });
  app.setGlobalPrefix('api');
  await app.startAllMicroservices();
  await app.listen(config.get('port')); // 8000
}

bootstrap();
