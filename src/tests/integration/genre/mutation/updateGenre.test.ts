import request from 'supertest';
import Genre from '../../../../db/models/GenreModel';
import User from '../../../../db/models/UserModel';
import server from '../../../../app';
import mongoose from 'mongoose';

describe('Mutation: updateGenre', () => {
  let token: string;
  let genreId: string;
  let name: string;
  let updatedName: string;

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
    name = 'New Genre';
    updatedName = name + ' updated';
  });

  const exec = async () => {
    return await request(server).post('/graphql').send({
      query: `mutation {
        updateGenre(id: "${genreId}", name: "${updatedName}") {
          id
          name
        }
      }`,
    }).set('Authorization', 'Bearer ' + token);
  };

  const createGenre = async () => {
    const genre = new Genre({name: 'genre1'});
    await genre.save();
    genreId = genre._id;
  };

  it('should return an error is user is not authenticated', async () => {
    const res = await request(server).post('/graphql').send({
      query: `mutation {
        updateGenre(id: "${genreId}", name: "${name}") {
          id
          name
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
        genreId = '60912b1d7914b1aee8377461';
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message).toContain('Could not find genre for given id');
      },
  );

  it('should return an error if name is less than 5 chars', async () => {
    updatedName = '1234';
    await createGenre();
    const res = await exec();

    const message = res.body.errors.map(
        (err: Error) => err.message).join(', ');
    expect(message)
        .toContain('"name" length must be at least 5 characters long');
  });

  it('should return an error if name is more than 50 chars', async () => {
    updatedName = new Array(52).join('a');
    await createGenre();
    const res = await exec();

    const message = res.body.errors.map(
        (err: Error) => err.message).join(', ');
    expect(message).toContain('"name" length must be less' +
        ' than or equal to 50 characters long');
  });

  it('should update genre if id and name are valid', async () => {
    await createGenre();
    await exec();

    const genre = await Genre.find({name: updatedName});
    expect(genre).toBeTruthy();
  });

  it('should return genre if id and name are valid', async () => {
    await createGenre();
    const res = await exec();

    expect(res.body.data.updateGenre).toHaveProperty('id');
    expect(res.body.data.updateGenre).toHaveProperty('name', updatedName);
  });
});
