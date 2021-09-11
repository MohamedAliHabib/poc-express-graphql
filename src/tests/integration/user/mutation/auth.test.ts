
import request from 'supertest';
import User from '../../../../db/models/UserModel';
import server from '../../../../app';
import {hashPassword} from '../../../../db/services/user/functions/createUser';


describe('Mutation: login', () => {
  let name: string;
  let email: string;
  let password: string;
  let hashedPassword: string;
  let phone: string;
  let age: number;

  afterEach(async () => {
    await User.deleteMany({});
  });

  beforeEach(async () => {
    name = 'user1';
    email = 'user@testing.com';
    password = 'Test1234!';
    phone = '+1 4801849392';
    age = 25;

    hashedPassword = await hashPassword(password);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      age,
      phone,
      isAdmin: true,
    });

    await user.save();
  });

  const exec = async () => {
    return await request(server).post('/graphql').send({
      query: `mutation {
        login(authInput: {
          email: "${email}",
          password: "${password}",
        }) {
          id
          name
          email
          phone
          age
          accessToken
          refreshToken
        }
      }`,
    });
  };

  it('should return an error if email is empty',
      async () => {
        email = '';
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message).toContain('"email" is not allowed to be empty');
      },
  );

  it('should return an error if email is less than 5 characters',
      async () => {
        email = '1234';
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message)
            .toContain('"email" length must be at least 5 characters long');
      },
  );

  it('should return an error if email is more than 255 characters',
      async () => {
        email = new Array(257).join('a') + '@testing.com';
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message).toContain('"email" length must be less' +
          ' than or equal to 255 characters long');
      },
  );

  it('should return an error if email is invalid',
      async () => {
        email = '1234';
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message)
            .toContain('"email" length must be at least 5 characters long');
      },
  );

  it('should return an error if password is empty',
      async () => {
        password = '';
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message).toContain('"password" is not allowed to be empty');
      },
  );

  it('should return an error if password is less than 8 characters',
      async () => {
        password = '1234567';
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message)
            .toContain('"password" length must be at least 8 characters long');
      },
  );

  it('should return an error if password is more than 255 characters',
      async () => {
        password = new Array(257).join('1');
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message).toContain('"password" length must be less' +
          ' than or equal to 255 characters long');
      },
  );

  it('should return an error if password is invalid',
      async () => {
        password = 'password';
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message).toContain('Invalid email or password.');
      },
  );

  it('should return login credentials if data is valid', async () => {
    const res = await exec();

    expect(res.body.data.login).toHaveProperty('id');
    expect(res.body.data.login).toHaveProperty('name', name);
    expect(res.body.data.login).toHaveProperty('email', email);
    expect(res.body.data.login).toHaveProperty('age', age);
    expect(res.body.data.login).toHaveProperty('phone', phone);
    expect(res.body.data.login).toHaveProperty('accessToken');
    expect(res.body.data.login).toHaveProperty('refreshToken');
  });
});
