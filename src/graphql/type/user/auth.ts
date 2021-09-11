import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
} from 'graphql';

const AuthType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Auth',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    email: {type: GraphQLString},
    age: {type: GraphQLInt},
    phone: {type: GraphQLString},
    accessToken: {type: GraphQLString},
    refreshToken: {type: GraphQLString},
  }),
});

export default AuthType;
