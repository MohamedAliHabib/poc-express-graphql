import Movie from '../../../models/MovieModel';
import IMovie from '../../../interfaces/IMovie';
import validate from '../../../validators/MovieValidator';
import {getGenre} from '../../genre/GenreService';
import {ValidationError} from 'joi';
import validateID from '../../../validators/IDValidator';

export async function updateMovie(data: IMovie):
  Promise<IMovie | ValidationError> {
  validateID(data.id);
  const {error} = validate(data);
  if (error) return error;

  const genre = await getGenre(data.genreId);

  // const movie = await Movie.findOneAndUpdate({_id: data.id}, {
  //     name: data.name,
  //     genre: genre,
  //     numberInStock: data.numberInStock,
  //     dailyRentalRate: data.dailyRentalRate
  // }, { new: true });
  const movie: IMovie | null = await Movie.findOne({_id: data.id});
  if (!movie) {
    throw new Error('Could not find movie for given id');
  }
  movie.set({
    name: data.name,
    genre: genre,
    numberInStock: data.numberInStock,
    dailyRentalRate: data.dailyRentalRate,
  });
  await movie.save();

  return movie;
}
