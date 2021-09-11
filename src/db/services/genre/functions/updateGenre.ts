import {ValidationError} from 'joi';
import IGenre from '../../../interfaces/IGenre';
import Movie from '../../../models/MovieModel';
import validate from '../../../validators/GenreValidator';
import validateID from '../../../validators/IDValidator';
import {getGenre} from './getGenre';

export async function updateGenre(data: IGenre):
  Promise<IGenre | ValidationError> {
  validateID(data.id);

  const {error} = validate(data);
  if (error) return error;

  const genre: IGenre = await getGenre(data.id);
  if (!genre) throw new Error('Could not find genre for given id');
  const originalName = genre.name;
  genre.set({name: data.name});
  await genre.save();

  // update genre in movies
  await Movie.updateMany(
      {'genre.name': originalName},
      {$set: {'genre': genre}},
  );

  return genre;
}
