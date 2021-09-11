import {Types} from 'mongoose';
import IGenre from '../../../interfaces/IGenre';
import Genre from '../../../models/GenreModel';
import validateID from '../../../validators/IDValidator';

export async function getGenre(id: Types.ObjectId): Promise<IGenre> {
  validateID(id);
  const genre: IGenre | null = await Genre.findById(id);
  if (!genre) throw new Error('Could not find genre for given id');
  return genre;
}
