import jsonwebtoken from 'jsonwebtoken';
import config from 'config';
import IUser from '../db/interfaces/IUser';
import IMovie from '../db/interfaces/IMovie';
import Movie from '../db/models/MovieModel';
import IGenre from '../db/interfaces/IGenre';

const delay = (ms: number): Promise<NodeJS.Timeout> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const generateTestAccessToken = (user: IUser, expiresIn: string): string => {
  const token = jsonwebtoken.sign({
    _id: user._id,
    isAdmin: user.isAdmin,
  },
  config.get('jwtPrivateKey'),
  {expiresIn: expiresIn});
  return token;
};

const generateTestRefresToken = (user: IUser, expiresIn: string): string => {
  const token = jsonwebtoken.sign({_id: user._id},
      config.get('jwtPrivateKey'), {expiresIn: expiresIn});
  return token;
};

const createMovie = async (
    name: string,
    genre: IGenre,
    numberInStock: number,
    dailyRentalRate: number,
): Promise<IMovie> => {
  const movie = new Movie({
    name: name,
    genre: genre,
    numberInStock: numberInStock,
    dailyRentalRate: dailyRentalRate,
  });

  return await movie.save();
};

const TestUtils = {
  delay,
  generateTestAccessToken,
  generateTestRefresToken,
  createMovie,
};

export default TestUtils;
