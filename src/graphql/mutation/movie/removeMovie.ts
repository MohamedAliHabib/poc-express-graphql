import {GraphQLNonNull, GraphQLID} from 'graphql';
import MovieType from '../../type/movie/movie';
import IMovie from '../../../db/interfaces/IMovie';
import {removeMovie} from '../../../db/services/movie/MovieService';

export default {
  type: MovieType,
  args: {
    id: {type: new GraphQLNonNull(GraphQLID)},
  },
  resolve(parent: any, args: any, req: any): Promise<IMovie> {
    req.requiresAuth(req.token);
    req.requiresAdmin(req.token);
    return removeMovie(args.id);
  },
};
