import config from 'config';
import logger from '../utils/logger';

export default function checkJwtKey(): void {
  if (!config.get('jwtPrivateKey')) {
    logger.error([
      'jwtPrivateKey is not defined',
      'please set `jwtPrivateKey` value in your terminal',
      'do not try to define it in your `.env` file.',
    ].join(', '));
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  }
}
