
import mongoose from 'mongoose';
import IMovie from '../interfaces/IMovie';
import {genreSchema} from './GenreModel';

export const movieSchema: mongoose.Schema<IMovie> =
new mongoose.Schema<IMovie>({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  // embedding document style
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
  },
});

const Movie: mongoose.Model<IMovie> = mongoose.model('Movies', movieSchema);

export default Movie;
