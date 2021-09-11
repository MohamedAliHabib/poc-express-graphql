import IGenre from '../../../interfaces/IGenre';
import Genre from '../../../models/GenreModel';
import Movie from '../../../models/MovieModel';
import validateID from '../../../validators/IDValidator';
import {Types} from 'mongoose';

export async function removeGenre(id: Types.ObjectId): Promise<IGenre> {
  validateID(id);
  const genre = await Genre.findByIdAndRemove(id);
  if (!genre) throw new Error('Could not find genre for given id');
  // remove genre from movies
  await Movie.updateMany({'genre.name': genre.name}, {$unset: {'genre': ''}});
  return genre;
}
