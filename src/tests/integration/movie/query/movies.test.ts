import request from 'supertest';
import Movie from '../../../../db/models/MovieModel';
import server from '../../../../app';
import Genre from '../../../../db/models/GenreModel';

describe('Query: movies', () => {
  afterEach(async () => {
    await Genre.deleteMany({});
    await Movie.deleteMany({});
  });

  it('should return all movies', async () => {
    const genre = new Genre({name: 'genre1'});
    await genre.save();

    const movies = [
      new Movie({
        name: 'movie1',
        genre: genre,
        numberInStock: 100,
        dailyRentalRate: 10,
      }),
      new Movie({
        name: 'movie2',
        genre: genre,
        numberInStock: 200,
        dailyRentalRate: 20,
      }),
    ];
    await Movie.collection.insertMany(movies);

    const res = await request(server).post('/graphql').send({
      query: `{
        movies {
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

    expect(res.body.data.movies.length).toBe(2);
    expect(res.body.data.movies.some((movie: Error) => movie.name === 'movie1'))
        .toBeTruthy();
    expect(res.body.data.movies.some((movie: Error) => movie.name === 'movie2'))
        .toBeTruthy();
  });

  it('should return an error if passed genreId is invalid', async () => {
    const res = await request(server).post('/graphql').send({
      query: `{
        movies(genreId: "${1}") {
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

    const message = res.body.errors.map(
        (err: Error) => err.message).join(', ');
    expect(message).toContain('Invalid id');
  });

  it('should return movies of specific genre', async () => {
    const genre1 = new Genre({name: 'genre1'});
    await genre1.save();
    const genre2 = new Genre({name: 'genre2'});
    await genre2.save();

    const movies = [
      new Movie({
        name: 'movie1',
        genre: genre1,
        numberInStock: 100,
        dailyRentalRate: 10,
      }),
      new Movie({
        name: 'movie2',
        genre: genre2,
        numberInStock: 200,
        dailyRentalRate: 20,
      }),
    ];
    await Movie.collection.insertMany(movies);

    const res = await request(server).post('/graphql').send({
      query: `{
        movies(genreId: "${genre1._id}") {
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

    expect(res.body.data.movies.length).toBe(1);
    expect(res.body.data.movies[0]).toHaveProperty('name', movies[0].name);
  });
});

