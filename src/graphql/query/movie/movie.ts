import {GraphQLID} from 'graphql';
import _ from 'lodash';
import MovieType from '../../type/movie/movie';
import {getMovie} from '../../../db/services/movie/MovieService';
import IMovie from '../../../db/interfaces/IMovie';

export default {
  type: MovieType,
  args: {id: {type: GraphQLID}},
  resolve(parent: any, args: any): Promise<IMovie> {
    return getMovie(args.id);
  },
};
