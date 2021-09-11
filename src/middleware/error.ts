// import winston from 'winston';
import logger from '../utils/logger';

export default function(err: Error, req: any, res: any, next: any): void {
  logger.error(err.message, err);
  throw new Error('Something failed :(');
}
