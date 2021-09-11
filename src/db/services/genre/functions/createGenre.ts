import {ValidationError} from 'joi';
import IGenre from '../../../interfaces/IGenre';
import Genre from '../../../models/GenreModel';
import validate from '../../../validators/GenreValidator';


export async function createGenre(data: IGenre):
  Promise<IGenre | ValidationError> {
  const {error} = validate(data);
  if (error) return error;

  const genre: IGenre = new Genre({name: data.name});
  await genre.save();

  return genre;
}
