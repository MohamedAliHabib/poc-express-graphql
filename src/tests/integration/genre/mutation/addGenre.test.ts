
import request from 'supertest';
import Genre from '../../../../db/models/GenreModel';
import User from '../../../../db/models/UserModel';
import server from '../../../../app';

describe('Mutation: addGenre', () => {
  let token: string;
  let name: string;

  const exec = async () => {
    return await request(server).post('/graphql').send({
      query: `mutation { addGenre(name: "${name}") {id name} }`,
    }).set('Authorization', 'Bearer ' + token);
  };

  afterEach(async () => {
    await Genre.deleteMany({});
  });

  beforeEach(() => {
    token = new User().generateAuthToken();
    name = 'genre1';
  });

  it('should return an error is user is not authenticated', async () => {
    const res = await request(server).post('/graphql').send({
      query: `mutation { addGenre(name: "${name}") {id name} }`,
    });

    const message = res.body.errors.map((err: Error) => err.message).join(', ');
    expect(message).toContain('Requires authentication');
  });

  it('should return an error if name is less than 5 characters',
      async () => {
        name = '1234';

        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message)
            .toContain('"name" length must be at least 5 characters long');
      });

  it('should return an error if name is more than 50 characters',
      async () => {
        name = new Array(52).join('a');

        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message).toContain('"name" length must be less' +
          ' than or equal to 50 characters long');
      });

  it('should save genre if name is valid', async () => {
    await exec();

    const genre = await Genre.find({name: name});
    expect(genre).not.toBeNull();
  });

  it('should return genre if name is valid', async () => {
    const res = await exec();

    expect(res.body.data.addGenre).toHaveProperty('id');
    expect(res.body.data.addGenre).toHaveProperty('name', name);
  });
});
