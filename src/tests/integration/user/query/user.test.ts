import request from 'supertest';
import User from '../../../../db/models/UserModel';
import server from '../../../../app';
import mongoose from 'mongoose';

describe('Query: user', () => {
  let token: string;
  let userId: string;
  let name: string;
  let email: string;
  let age: number;
  let phone: string;
  let isAdmin: boolean;

  const createUser = async () => {
    const user = new User({
      name,
      email,
      password: 'Test1234!',
      age,
      phone,
      isAdmin,
    });
    await user.save();

    userId = user._id;
  };

  const exec = async () => {
    return await request(server).post('/graphql').send({
      query: `{
        user(id: "${userId}") {
          id
          name
          email
          age
          phone
          isAdmin
        }
      }`,
    }).set('Authorization', 'Bearer ' + token);
  };

  afterEach(async () => {
    await User.deleteMany({});
  });

  beforeEach(async () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const user = new User(payload);
    token = user.generateAuthToken();

    name = 'Tester user';
    email = 'user@testing.com';
    age = 20;
    phone = '+1 4801849392';
    isAdmin = true;
    await createUser();
  });

  it('should return an error if id is not provided as an argument',
      async () => {
        userId = '';
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message).toContain('id must be provided');
      },
  );

  it('should return an error if given id is invalid',
      async () => {
        userId = '1';
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message).toContain('Invalid id');
      },
  );

  it('should return an error if could not find user for given id',
      async () => {
        userId = '60912b1d7914b1aee8377461';
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message).toContain('Could not find user for given id');
      },
  );

  it('should return a user if valid id is passed', async () => {
    const res = await exec();

    expect(res.body.data.user).toHaveProperty('name', name);
    expect(res.body.data.user).toHaveProperty('email', email);
    expect(res.body.data.user).toHaveProperty('age', age);
    expect(res.body.data.user).toHaveProperty('phone', phone);
    expect(res.body.data.user).toHaveProperty('isAdmin', isAdmin);
  });
});
