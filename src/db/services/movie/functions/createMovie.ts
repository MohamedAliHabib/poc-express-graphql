import Movie from '../../../models/MovieModel';
import validate from '../../../validators/MovieValidator';
import {getGenre} from '../../genre/GenreService';
import IMovie from '../../../interfaces/IMovie';
import IGenre from '../../../interfaces/IGenre';
import {ValidationError} from 'joi';

export async function createMovie(data: IMovie):
  Promise<IMovie | ValidationError> {
  const {error} = validate(data);
  if (error) return error;

  const genre: IGenre = await getGenre(data.genreId);

  const movie = new Movie({
    name: data.name,
    genre: genre,
    // Hybrid approach: using only some of the properties. ex:
    // genre: {
    //     _id: genre.id,
    //     name: genre.name,
    // },
    numberInStock: data.numberInStock,
    dailyRentalRate: data.dailyRentalRate,
  });
  await movie.save();

  return movie;
}
