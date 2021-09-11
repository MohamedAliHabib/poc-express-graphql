import request from 'supertest';
import Movie from '../../../../db/models/MovieModel';
import Genre from '../../../../db/models/GenreModel';
import server from '../../../../app';
import IMovie from '../../../../db/interfaces/IMovie';
import TestUtils from '../../../testUtils';

describe('Query: movie', () => {
  let movieId: string;
  let movieName: string;
  let numberInStock: number;
  let dailyRentalRate: number;

  const exec = async () => {
    return await request(server).post('/graphql').send({
      query: `{
        movie(id: "${movieId}") {
          id
          name
          genre {
            id
            name
          }
          numberInStock
          dailyRentalRate
        }
      }`,
    });
  };

  afterEach(async () => {
    await Genre.deleteMany({});
    await Movie.deleteMany({});
  });

  beforeEach(async () => {
    const genre = new Genre({name: 'genre1'});
    await genre.save();

    movieName = 'movie1';
    numberInStock = 100;
    dailyRentalRate = 10;

    const movie: IMovie = await TestUtils.createMovie(
        movieName,
        genre,
        numberInStock,
        dailyRentalRate,
    );
    movieId = movie._id;
  });

  it('should return an error if id is not provided as an argument',
      async () => {
        movieId = '';
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message).toContain('id must be provided');
      },
  );

  it('should return an error if given id is invalid',
      async () => {
        movieId = '1';
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message).toContain('Invalid id');
      },
  );

  it('should return an error if could not find movie for given id',
      async () => {
        movieId = '60912b1d7914b1aee8377461';
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message).toContain('Could not find movie for given id');
      },
  );

  it('should return movie if id is valid', async () => {
    const res = await exec();

    expect(res.body.data.movie).toHaveProperty('id');
    expect(res.body.data.movie).toHaveProperty('name', movieName);
    expect(res.body.data.movie).toHaveProperty('numberInStock', numberInStock);
    expect(res.body.data.movie)
        .toHaveProperty('dailyRentalRate', dailyRentalRate);
  });
});
