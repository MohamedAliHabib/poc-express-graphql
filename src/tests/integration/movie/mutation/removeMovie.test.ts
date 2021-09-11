import request from 'supertest';
import Genre from '../../../../db/models/GenreModel';
import Movie from '../../../../db/models/MovieModel';
import User from '../../../../db/models/UserModel';
import server from '../../../../app';
import mongoose from 'mongoose';
import TestUtils from '../../../testUtils';
import IMovie from '../../../../db/interfaces/IMovie';

describe('Mutation: removeMovie', () => {
  let token: string;
  let movieId: string;
  let movieName: string;
  let numberInStock: number;
  let dailyRentalRate: number;

  const exec = async () => {
    return await request(server).post('/graphql').send({
      query: `mutation {
        removeMovie(id: "${movieId}") {
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
    }).set('Authorization', 'Bearer ' + token);
  };

  afterEach(async () => {
    await Genre.deleteMany({});
    await Movie.deleteMany({});
  });

  beforeEach(async () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const user = new User(payload);
    token = user.generateAuthToken();

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

  it('should return an error is user is not authenticated', async () => {
    const res = await request(server).post('/graphql').send({
      query: `mutation {
          removeMovie(id: "${movieId}") {
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

    const message = res.body.errors.map((err: Error) => err.message).join(', ');
    expect(message).toContain('Requires authentication');
  });

  it('should return an error is user is not admin', async () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: false,
    };
    const user = new User(payload);
    token = user.generateAuthToken();

    const res = await exec();

    const message = res.body.errors.map((err: Error) => err.message).join(', ');
    expect(message).toContain('Action Denied');
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
        movieId = '60893ee520d286772ccc5312';
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message).toContain('Could not find movie for given id');
      },
  );

  it('should remove movie if id is valid', async () => {
    await exec();

    const genre = await Genre.find({name: movieName});
    expect(genre.length).toBe(0);
  });

  it('should return movie if id is valid', async () => {
    const res = await exec();

    expect(res.body.data.removeMovie).toHaveProperty('id');
    expect(res.body.data.removeMovie).toHaveProperty('name', movieName);
    expect(res.body.data.removeMovie)
        .toHaveProperty('numberInStock', numberInStock);
    expect(res.body.data.removeMovie)
        .toHaveProperty('dailyRentalRate', dailyRentalRate);
  });
});
