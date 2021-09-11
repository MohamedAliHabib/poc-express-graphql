
import request from 'supertest';
import Movie from '../../../../db/models/MovieModel';
import Genre from '../../../../db/models/GenreModel';
import User from '../../../../db/models/UserModel';
import server from '../../../../app';

describe('Mutation: addMovie', () => {
  let token: string;
  let name: string;
  let numberInStock: number;
  let dailyRentalRate: number;
  let genreId: string;

  afterEach(async () => {
    await Genre.deleteMany({});
    await Movie.deleteMany({});
  });

  beforeEach(async () => {
    token = new User().generateAuthToken();

    const genre = new Genre({name: 'genre1'});
    await genre.save();
    genreId = genre._id;
    name = 'Interstellar';
    numberInStock = 200;
    dailyRentalRate = 20;
  });

  const exec = async () => {
    return await request(server).post('/graphql').send({
      query: `mutation {
        addMovie(
            movieInput: {
            name: "${name}", 
            numberInStock: ${numberInStock},
            dailyRentalRate: ${dailyRentalRate}, 
            genreId: "${genreId}"
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
          addMovie(
              movieInput: {
              name: "${name}", 
              numberInStock: ${numberInStock}, 
              dailyRentalRate: ${dailyRentalRate}, 
              genreId: "1"
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

  it('should return an error if name is less than 5 characters',
      async () => {
        name = '1234';
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message)
            .toContain('"name" length must be at least 5 characters long');
      },
  );

  it('should return an error if name is more than 255 characters',
      async () => {
        name = new Array(257).join('a');

        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message).toContain('"name" length must be less' +
          ' than or equal to 255 characters long');
      },
  );

  it('should return an error if dailyRentalRate less than 0',
      async () => {
        dailyRentalRate = -1;

        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message)
            .toContain('"dailyRentalRate" must be greater than or equal to 0');
      },
  );

  it('should return an error if numberInStock less than 0',
      async () => {
        numberInStock = -1;

        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message)
            .toContain('"numberInStock" must be greater than or equal to 0');
      },
  );

  it('should save movie if data is valid', async () => {
    await exec();

    const createdMovie = await Genre.find({name: name});
    expect(createdMovie).not.toBeNull();
  });

  it('should return movie if data is valid', async () => {
    const res = await exec();

    expect(res.body.data.addMovie).toHaveProperty('id');
    expect(res.body.data.addMovie).toHaveProperty('name', name);
    expect(res.body.data.addMovie)
        .toHaveProperty('numberInStock', numberInStock);
    expect(res.body.data.addMovie)
        .toHaveProperty('dailyRentalRate', dailyRentalRate);
  });
});
