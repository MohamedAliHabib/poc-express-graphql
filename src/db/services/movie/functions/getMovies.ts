import {Types} from 'mongoose';
import IMovie from '../../../interfaces/IMovie';
import Movie from '../../../models/MovieModel';
import validateID from '../../../validators/IDValidator';

export async function getMovies(genreId?: Types.ObjectId):
Promise<Array<IMovie>> {
  if (genreId) {
    validateID(genreId);
    return await Movie.find().where('genre._id').equals(genreId).sort('name');
  } else {
    return await Movie.find().sort('name');
  }
}
