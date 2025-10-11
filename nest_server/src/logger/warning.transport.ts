import 'winston-daily-rotate-file';
import * as winston from "winston"
import {filterOnly} from "src/logger/error.transport";
 export const warnTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/warn-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'warn',
  format: winston.format.combine(
    filterOnly('warn'),
    winston.format.timestamp(),
    winston.format.json(),
  ),
});
