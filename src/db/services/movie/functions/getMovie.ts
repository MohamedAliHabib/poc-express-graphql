import IMovie from '../../../interfaces/IMovie';
import Movie from '../../../models/MovieModel';
import validateID from '../../../validators/IDValidator';
import {Types} from 'mongoose';

export async function getMovie(id: Types.ObjectId): Promise<IMovie> {
  validateID(id);
  const movie = await Movie.findById(id);
  if (!movie) throw new Error('Could not find movie for given id');
  return movie;
}
