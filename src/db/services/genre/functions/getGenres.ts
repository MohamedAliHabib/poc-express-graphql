import IGenre from '../../../interfaces/IGenre';
import Genre from '../../../models/GenreModel';

export async function getGenres(): Promise<Array<IGenre>> {
  return await Genre.find().sort('name');
}
