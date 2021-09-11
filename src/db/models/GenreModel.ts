import mongoose from 'mongoose';
import IGenre from '../interfaces/IGenre';

export const genreSchema: mongoose.Schema<IGenre> =
new mongoose.Schema<IGenre>({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

const Genre: mongoose.Model<IGenre> = mongoose.model('Genres', genreSchema);

export default Genre;
