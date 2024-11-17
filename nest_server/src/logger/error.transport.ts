import 'winston-daily-rotate-file';
import * as winston from 'winston';

export const errorTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  handleExceptions: true,
});

errorTransport.on('error', (err) => {
  console.error(`Error while logging to file : `, err);
});
