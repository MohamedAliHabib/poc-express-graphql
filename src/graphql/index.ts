import {GraphQLSchema} from 'graphql';
import Mutation from './mutation';
import RootQuery from './query/index';

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

export default schema;
