import { Global, Module } from '@nestjs/common';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import { errorTransport } from './error.transport';
import { infoTransport } from './info.transport';
import {warnTransport} from "./warning.transport";
import {exceptionTransport} from "./exceptions.transport";

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize({ all: true }),
            winston.format.json(),
            nestWinstonModuleUtilities.format.nestLike('TopTicketify', {
              prettyPrint: true,
              colors: true,
              appName: false,
            }),
          ),
        }),
        infoTransport,
        warnTransport,
        errorTransport,
      ],
      exceptionHandlers: [exceptionTransport],
    }),
  ],
  exports: [WinstonModule],
})
export class WinstonLoggerModule {}
