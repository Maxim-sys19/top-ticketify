import 'winston-daily-rotate-file';
import * as winston from 'winston';
import {filterOnly} from "src/logger/error.transport";

export const infoTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/info-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'info',
  format: winston.format.combine(
    filterOnly('info'),
    winston.format.timestamp(),
    winston.format.json(),
  ),
});
