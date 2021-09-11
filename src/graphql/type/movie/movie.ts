import {GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt} from 'graphql';
import GenreType from '../genre/genre';

const MovieType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    genre: {type: GenreType},
    numberInStock: {type: GraphQLInt},
    dailyRentalRate: {type: GraphQLInt},
  }),
});

export default MovieType;
