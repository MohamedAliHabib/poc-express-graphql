import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLInputObjectType,
} from 'graphql';

const movieInput = new GraphQLInputObjectType({
  name: 'movieInput',
  fields: {
    name: {type: new GraphQLNonNull(GraphQLString)},
    genreId: {type: GraphQLID},
    numberInStock: {type: new GraphQLNonNull(GraphQLInt)},
    dailyRentalRate: {type: new GraphQLNonNull(GraphQLInt)},
  },
});

export default movieInput;
