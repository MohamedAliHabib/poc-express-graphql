import {GraphQLObjectType} from 'graphql';
import movies from '../query/movie/movies';
import movie from '../query/movie/movie';
import genres from '../query/genre/genres';
import genre from '../query/genre/genre';
import users from '../query/user/users';
import user from '../query/user/user';

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    movies: movies,
    movie: movie,
    genres: genres,
    genre: genre,
    users: users,
    user: user,
  },
});

export default RootQuery;
