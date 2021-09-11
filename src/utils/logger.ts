import {createLogger, format, transports} from 'winston';
import config from './config';

const consoleLogFormat = format.printf(({level, message, timestamp, stack}) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: format.combine(
      format.timestamp(),
      format.errors({stack: true}),
      format.json(),
  ),
  transports: [
    new transports.File({filename: 'error.log', level: 'error'}),
    new transports.File({filename: 'combined.log'}),
  ],
});

if (config.env !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
        format.colorize(),
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        format.errors({stack: true}),
        consoleLogFormat,
    ),
  }));
}

export default logger;
