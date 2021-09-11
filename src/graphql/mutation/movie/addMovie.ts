import MovieType from '../../type/movie/movie';
import {createMovie} from '../../../db/services/movie/MovieService';
import movieInput from '../input/movieInput';
import IMovie from '../../../db/interfaces/IMovie';
import Joi from 'joi';


export default {
  type: MovieType,
  args: {
    movieInput: {type: movieInput},
  },
  resolve(parent: any, args: any, req: any):
  Promise<IMovie | Joi.ValidationError> {
    req.requiresAuth(req.token);
    return createMovie(args.movieInput);
  },
};
