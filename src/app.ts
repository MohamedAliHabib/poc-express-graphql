import express from 'express';
import logger from './utils/logger';
import dbConnect from './loaders/db';
import loadGql from './loaders/graphql';
import checkJwtKey from './loaders/jwtChecker';
import validationLoader from './loaders/validation';
import config from './utils/config';

const app = express();

// app.use(express.json());
dbConnect();
loadGql(app);
checkJwtKey();
validationLoader();

const port = config.port || 4000;
if (config.env === 'development' || config.env === 'production') {
  app.listen(port, () => {
    logger.info(`Listening for requests on port ${port}`);
  });
} else {
  logger.warn([
    'If you want the app to listen to requests',
    'please set NODE_ENV to either \'development\' or \'production\'',
  ].join(', '));
}

export default app;
