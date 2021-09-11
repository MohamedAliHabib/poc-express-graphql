import express from 'express';
import {graphqlHTTP} from 'express-graphql';
import schema from '../graphql/index';
import auth from '../middleware/auth';
import config from '../utils/config';

export default function loadGql(app: express.Application): void {
  app.use('/graphql', auth, graphqlHTTP((req: any, res: any) => ({
    schema,
    graphiql: config.env === 'development'? true: false,
  })));
}
