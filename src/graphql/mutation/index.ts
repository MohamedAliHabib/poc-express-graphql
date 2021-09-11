import {GraphQLObjectType} from 'graphql';
import addMovie from './movie/addMovie';
import updateMovie from './movie/updateMovie';
import removeMovie from './movie/removeMovie';
import updateGenre from './genre/updateGenre';
import removeGenre from './genre/removeGenre';
import addGenre from './genre/addGenre';
import register from './user/register';
import {login, renewToken} from './user/auth';

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addMovie: addMovie,
    updateMovie: updateMovie,
    removeMovie: removeMovie,
    addGenre: addGenre,
    updateGenre: updateGenre,
    removeGenre: removeGenre,
    register: register,
    login: login,
    renewToken: renewToken,
  },
});

export default Mutation;
