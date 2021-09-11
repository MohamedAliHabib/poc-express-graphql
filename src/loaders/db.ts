import mongoose from 'mongoose';
import config from 'config';
import logger from '../utils/logger';

export default function dbConnect(): void {
  const dbCS: string = config.get('db');
  mongoose.connect(dbCS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  const db = mongoose.connection;
  db.on('error', () => logger.error('Could not connect to db'));
  db.once('open', () => logger.info(`Connected to ${dbCS}`));
}
