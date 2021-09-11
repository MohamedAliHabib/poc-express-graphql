import request from 'supertest';
import Genre from '../../../../db/models/GenreModel';
import server from '../../../../app';

describe('Query: genre', () => {
  afterEach(async () => {
    await Genre.deleteMany({});
  });

  it('should return a genre if valid id is passed', async () => {
    const genre = new Genre({name: 'genre1'});
    await genre.save();

    const res = await request(server).post('/graphql').send({
      query: `{genre(id: "${genre._id}") {id name}}`,
    });

    expect(res.body.data.genre).toHaveProperty('name', genre.name);
  });

  it('should return an error if invalid id is passed', async () => {
    const res = await request(server).post('/graphql').send({
      query: '{genre(id: "1") {id name}}',
    });

    //   expect(res.status).toBe(200);
    const message = res.body.errors.map((err: Error) => err.message).join(', ');
    expect(message).toContain('Invalid id');
  });

  it('should return an error if could not find' +
    'genre and valid id is passed', async () => {
    const res = await request(server).post('/graphql').send({
      query: '{genre(id: "608547a738677bb9f6e6f6e6") {id name}}',
    });

    //   expect(res.status).toBe(200);
    const message = res.body.errors.map((err: Error) => err.message).join(', ');
    expect(message).toContain('Could not find genre for given id');
  });
});
