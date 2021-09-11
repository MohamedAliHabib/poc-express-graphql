import {GraphQLID, GraphQLList} from 'graphql';
import MovieType from '../../type/movie/movie';
import {getMovies} from '../../../db/services/movie/MovieService';
import IMovie from '../../../db/interfaces/IMovie';
import {Types} from 'mongoose';


const movies = {
  type: new GraphQLList(MovieType),
  args: {genreId: {type: GraphQLID}},
  resolve(parent: any, {genreId}: {genreId?: Types.ObjectId}):
  Promise<Array<IMovie>> {
    return getMovies(genreId);
  },
};

export default movies;
