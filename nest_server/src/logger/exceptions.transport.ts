import "winston-daily-rotate-file"
import * as winston from 'winston';

export const exceptionTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/exceptions-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  createSymlink: true,
  symlinkName: "exceptions.log",
  maxSize: '20m',
  maxFiles: '14d',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
})