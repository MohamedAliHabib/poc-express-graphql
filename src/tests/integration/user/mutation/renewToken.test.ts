
import request from 'supertest';
import User from '../../../../db/models/UserModel';
import server from '../../../../app';
import {hashPassword} from '../../../../db/services/user/functions/createUser';
import IUser from '../../../../db/interfaces/IUser';
import TestUtils from '../../../testUtils';


describe('Mutation: renewToken', () => {
  let name: string;
  let email: string;
  let password: string;
  let hashedPassword: string;
  let phone: string;
  let age: number;
  let accessToken: string;
  let refreshToken: string;
  let userDocument: IUser;

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

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
    userDocument = user;
  });

  const exec = async () => {
    return await request(server).post('/graphql').send({
      query: `mutation {
        renewToken (
          accessToken: "${accessToken}", 
          refreshToken: "${refreshToken}"
          ) {
          accessToken
          refreshToken
        }
      }`,
    });
  };

  it('should return an error if access token is empty',
      async () => {
        accessToken = '';
        refreshToken = TestUtils.generateTestRefresToken(userDocument, '20ms');
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message).toContain(
            'Values must be provided for both accessToken and refresh token.');
      },
  );

  it('should return an error if refresh token is empty',
      async () => {
        accessToken = TestUtils.generateTestRefresToken(userDocument, '20ms');
        refreshToken = '';
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message).toContain(
            'Values must be provided for both accessToken and refresh token.');
      },
  );

  it('should return an error if access token is still valid',
      async () => {
        accessToken = TestUtils.generateTestAccessToken(userDocument, '1min');
        refreshToken = TestUtils.generateTestRefresToken(userDocument, '2min');
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message).toContain('Access token is still valid');
      },
  );

  it('should return an error if refresh token is invalid',
      async () => {
        accessToken = TestUtils.generateTestAccessToken(userDocument, '10ms');
        refreshToken = TestUtils.generateTestRefresToken(userDocument, '20ms');
        await delay(30);
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message).toContain('Invalid refresh token.');
      },
  );

  it('should return an error if refresh token payload has invalid user id',
      async () => {
        userDocument._id = '6092649f852f7b686835be36';
        accessToken = TestUtils.generateTestAccessToken(userDocument, '10ms');
        refreshToken = TestUtils.generateTestRefresToken(userDocument, '2min');
        await delay(20);
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message).toContain('Could not find user.');
      },
  );

  it('should return an error if tokens belong to different users',
      async () => {
        accessToken = TestUtils.generateTestAccessToken(userDocument, '10ms');

        const anotherUser = new User({
          name: 'another user',
          email: 'another@testing.com',
          password: hashedPassword,
          age: 38,
          phone,
          isAdmin: true,
        });
        await anotherUser.save();

        refreshToken = TestUtils.generateTestRefresToken(anotherUser, '2min');

        await delay(20);

        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message)
            .toContain('Access and refresh tokens must be for the same user');
      },
  );

  it('should return new token pairs otherwise',
      async () => {
        accessToken = TestUtils.generateTestAccessToken(userDocument, '5ms');
        refreshToken = TestUtils.generateTestRefresToken(userDocument, '2min');

        await delay(10);

        const res = await exec();

        expect(res.body.data.renewToken).toHaveProperty('accessToken');
        expect(res.body.data.renewToken).toHaveProperty('refreshToken');
      },
  );
});
