import request from 'supertest';
import Genre from '../../../../db/models/GenreModel';
import server from '../../../../app';

describe('Query: genres', () => {
  afterEach(async () => {
    await Genre.deleteMany({});
  });

  it('should return all genres', async () => {
    const genres = [
      new Genre({name: 'genre1'}),
      new Genre({name: 'genre2'}),
    ];
    await Genre.collection.insertMany(genres);

    const res = await request(server).post('/graphql').send({
      query: '{genres {id name}}',
    });

    expect(res.status).toBe(200);
    expect(res.body.data.genres.length).toBe(2);
    expect(res.body.data.genres.some((g: Error) => g.name === 'genre1'))
        .toBeTruthy();
    expect(res.body.data.genres.some((g: Error) => g.name === 'genre2'))
        .toBeTruthy();
  });
});

