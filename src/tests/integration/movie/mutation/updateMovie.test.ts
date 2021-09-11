import request from 'supertest';
import Genre from '../../../../db/models/GenreModel';
import Movie from '../../../../db/models/MovieModel';
import User from '../../../../db/models/UserModel';
import server from '../../../../app';
import mongoose from 'mongoose';
import IMovie from '../../../../db/interfaces/IMovie';
import TestUtils from '../../../testUtils';

describe('Mutation: updateMovie', () => {
  let token: string;
  let movieId: string;
  let genreId: string;

  let name: string;
  let numberInStock: number;
  let dailyRentalRate: number;

  let updatedName: string;
  let updatedNumberInStock: number;
  let updatedDailyRentalRate: number;

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
    name = 'New Movie';
    numberInStock = 100;
    dailyRentalRate = 10;
    updatedName = name + ' updated';
    updatedNumberInStock = 200;
    updatedDailyRentalRate = 20;

    const genre = new Genre({name: 'genre1'});
    await genre.save();

    genreId = genre._id;

    const movie: IMovie = await TestUtils.createMovie(
        name,
        genre,
        numberInStock,
        dailyRentalRate,
    );
    movieId = movie._id;
  });

  const exec = async () => {
    return await request(server).post('/graphql').send({
      query: `mutation {
        updateMovie(
            id: "${movieId}", 
            movieInput: {
                name: "${updatedName}", 
                genreId: "${genreId}", 
                numberInStock: ${updatedNumberInStock}, 
                dailyRentalRate: ${updatedDailyRentalRate}
            }) {
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

  it('should return an error is user is not authenticated', async () => {
    const res = await request(server).post('/graphql').send({
      query: `mutation {
          updateMovie(
              id: "${movieId}", 
              movieInput: {
                  name: "${updatedName}", 
                  genreId: "${genreId}", 
                  numberInStock: ${updatedNumberInStock}, 
                  dailyRentalRate: ${updatedDailyRentalRate}
              }) {
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

  it('should return an error if name is less than 5 chars', async () => {
    updatedName = '1234';
    const res = await exec();

    const message = res.body.errors.map(
        (err: Error) => err.message).join(', ');
    expect(message)
        .toContain('"name" length must be at least 5 characters long');
  });

  it('should return an error if name is more than 255 chars', async () => {
    updatedName = new Array(257).join('a');
    const res = await exec();

    const message = res.body.errors.map(
        (err: Error) => err.message).join(', ');
    expect(message).toContain('"name" length must be less' +
        ' than or equal to 255 characters long');
  });

  it('should return an error if genreId is empty', async () => {
    genreId = '';
    const res = await exec();

    const message = res.body.errors.map(
        (err: Error) => err.message).join(', ');
    expect(message).toContain('"genreId" is not allowed to be empty');
  });

  it('should update movie if data is valid', async () => {
    await exec();

    const movie = await Movie.find({name: updatedName});
    expect(movie).toBeTruthy();
    expect(movie[0]).toHaveProperty('name', updatedName);
    expect(movie[0]).toHaveProperty('numberInStock', updatedNumberInStock);
    expect(movie[0]).toHaveProperty('dailyRentalRate', updatedDailyRentalRate);
  });

  it('should return movie if data is valid', async () => {
    const res = await exec();

    expect(res.body.data.updateMovie).toHaveProperty('id');
    expect(res.body.data.updateMovie).toHaveProperty('name', updatedName);
    expect(res.body.data.updateMovie)
        .toHaveProperty('numberInStock', updatedNumberInStock);
    expect(res.body.data.updateMovie)
        .toHaveProperty('dailyRentalRate', updatedDailyRentalRate);
  });
});
