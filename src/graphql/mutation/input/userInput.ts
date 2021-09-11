import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLInputObjectType,
} from 'graphql';

const userInput = new GraphQLInputObjectType({
  name: 'userInput',
  fields: {
    name: {type: new GraphQLNonNull(GraphQLString)},
    email: {type: new GraphQLNonNull(GraphQLString)},
    password: {type: new GraphQLNonNull(GraphQLString)},
    age: {type: new GraphQLNonNull(GraphQLInt)},
    phone: {type: GraphQLString},
  },
});

export default userInput;
