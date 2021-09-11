import request from 'supertest';
import User from '../../../db/models/UserModel';
import server from '../../../app';
import mongoose from 'mongoose';
import TestUtils from '../../testUtils';

const users = [
  new User({
    name: 'user1',
    email: 'user1@testing.com',
    password: 'Test1234!',
    age: 25,
    phone: '+1 4801849392',
    isAdmin: true,
  }),
  new User({
    name: 'user2',
    email: 'user2@testing.com',
    password: 'Test1234!',
    age: 30,
    phone: '+1 4801849377',
    isAdmin: false,
  }),
];

describe('Middleware', () => {
  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('requiresAuth', () => {
    let token: string;

    const exec = async () => {
      return await request(server).post('/graphql').send({
        query: `mutation { addGenre(name: "${'genre1'}") {id name} }`,
      }).set('Authorization', 'Bearer ' + token);
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
    });

    it('should return an error if no token is provided', async () => {
      const res = await request(server).post('/graphql').send({
        query: `mutation { addGenre(name: "${'genre1'}") {id name} }`,
      });

      const message = res.body.errors.map((err: Error) => err.message)
          .join(', ');
      expect(message).toContain('Requires authentication');
    });


    it('should return an error if token has an expected (malformed) structure',
        async () => {
          token = 'a';

          const res = await exec();

          const message = res.body.errors.map(
              (err: Error) => err.message).join(', ');
          expect(message).toContain('Token is malformed');
        });

    it('should return an error if token is expired',
        async () => {
          token = TestUtils.generateTestAccessToken(new User(), '10ms');
          await TestUtils.delay(20);
          const res = await exec();

          const message = res.body.errors.map(
              (err: Error) => err.message).join(', ');
          expect(message).toContain('Token has expired');
        },
    );

    it('should return an error if token is invalid',
        async () => {
          // alter any thing in the token
          token = token.slice(0, -1);

          const res = await exec();

          const message = res.body.errors.map(
              (err: Error) => err.message).join(', ');
          expect(message).toContain('Invalid token');
        },
    );

    it('should return data if token is valid', async () => {
      const res = await exec();

      expect(res.body.data.addGenre).toHaveProperty('id');
      expect(res.body.data.addGenre).toHaveProperty('name', 'genre1');
    });
  });

  describe('requiresAdmin', () => {
    let token: string;

    const exec = async () => {
      return await request(server).post('/graphql').send({
        query: '{users {id name}}',
      }).set('Authorization', 'Bearer ' + token);
    };

    beforeEach(async () => {
      const payload = {
        _id: new mongoose.Types.ObjectId().toHexString(),
        isAdmin: true,
      };
      const user = new User(payload);
      token = user.generateAuthToken();

      await User.collection.insertMany(users);
    });


    it('should return an error if token is invalid',
        async () => {
          token = token.slice(0, -1);

          const res = await exec();

          const message = res.body.errors.map(
              (err: Error) => err.message).join(', ');
          expect(message).toContain('Invalid token');
        },
    );

    it('should return an error if user is not an admin', async () => {
      token = new User().generateAuthToken();
      const res = await exec();

      const message = res.body.errors.map(
          (err: Error) => err.message).join(', ');
      expect(message).toContain('Action Denied');
    });

    it('should return data if user is an admin', async () => {
      const res = await exec();

      expect(res.body.data.users.length).toBe(2);
      expect(res.body.data.users[0]).toHaveProperty('id');
      expect(res.body.data.users[0]).toHaveProperty('name', users[0].name);
    });
  });
});
