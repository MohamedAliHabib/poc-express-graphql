import request from 'supertest';
import Genre from '../../../../db/models/GenreModel';
import User from '../../../../db/models/UserModel';
import server from '../../../../app';
import mongoose from 'mongoose';

describe('Mutation: removeGenre', () => {
  let token: string;
  let genreId: string;

  const exec = async () => {
    return await request(server).post('/graphql').send({
      query: `mutation { removeGenre(id: "${genreId}") {id name} }`,
    }).set('Authorization', 'Bearer ' + token);
  };

  afterEach(async () => {
    await Genre.deleteMany({});
  });

  beforeEach(() => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const user = new User(payload);
    token = user.generateAuthToken();
    genreId = '';
  });

  it('should return an error is user is not authenticated', async () => {
    const res = await request(server).post('/graphql').send({
      query: `mutation { removeGenre(id: "${genreId}") {id name} }`,
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
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message).toContain('id must be provided');
      },
  );

  it('should return an error if given id is invalid',
      async () => {
        genreId = '1';
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message).toContain('Invalid id');
      },
  );

  it('should return an error if could not find genre for given id',
      async () => {
        genreId = '60893ee520d286772ccc5312';
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message).toContain('Could not find genre for given id');
      },
  );

  it('should remove genre if id is valid', async () => {
    const createdGenre = new Genre({name: 'genre1'});
    await createdGenre.save();
    genreId = createdGenre._id;

    await exec();

    const genre = await Genre.find({name: createdGenre.name});
    expect(genre.length).toBe(0);
  });

  it('should return genre if id is valid', async () => {
    const genre = new Genre({name: 'genre1'});
    await genre.save();
    genreId = genre._id;

    const res = await exec();

    expect(res.body.data.removeGenre).toHaveProperty('id');
    expect(res.body.data.removeGenre).toHaveProperty('name', genre.name);
  });
});
