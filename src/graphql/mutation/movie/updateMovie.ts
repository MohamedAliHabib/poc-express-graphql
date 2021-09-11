import {GraphQLNonNull, GraphQLID} from 'graphql';
import MovieType from '../../type/movie/movie';
import {updateMovie} from '../../../db/services/movie/MovieService';
import movieInput from '../input/movieInput';
import Joi from 'joi';
import IMovie from '../../../db/interfaces/IMovie';

export default {
  type: MovieType,
  args: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    movieInput: {type: movieInput},
  },
  resolve(parent: any, args: any, req: any):
  Promise<IMovie | Joi.ValidationError> {
    // busienss logic rules should be here?
    req.requiresAuth(req.token);
    req.requiresAdmin(req.token);
    return updateMovie({id: args.id, ...args.movieInput});
  },
};
