import IMovie from '../../../interfaces/IMovie';
import Movie from '../../../models/MovieModel';
import validateID from '../../../validators/IDValidator';
import {Types} from 'mongoose';

export async function removeMovie(id: Types.ObjectId): Promise<IMovie> {
  validateID(id);
  const movie: IMovie | null = await Movie.findByIdAndRemove(id);
  if (!movie) {
    throw new Error('Could not find movie for given id');
  }
  return movie;
}
