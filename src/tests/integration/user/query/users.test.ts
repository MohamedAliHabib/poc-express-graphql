import request from 'supertest';
import User from '../../../../db/models/UserModel';
import server from '../../../../app';
import mongoose from 'mongoose';
import IUser from '../../../../db/interfaces/IUser';

describe('Query: users', () => {
  let token: string;

  afterEach(async () => {
    await User.deleteMany({});
  });

  beforeEach(() => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const user = new User(payload);
    token = user.generateAuthToken();
  });

  it('should return all users', async () => {
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
    await User.collection.insertMany(users);

    const res = await request(server).post('/graphql').send({
      query: `{
        users {
          id
          name
          email
          age
          phone
          isAdmin
        }
      }`,
    }).set('Authorization', 'Bearer ' + token);

    expect(res.status).toBe(200);
    expect(res.body.data.users.length).toBe(2);

    expect(res.body.data.users.some((user: IUser) => user.name === 'user1'))
        .toBeTruthy();
    expect(res.body.data.users
        .some((user: IUser) => user.email === 'user1@testing.com'))
        .toBeTruthy();
    expect(res.body.data.users.some((user: IUser) => user.age === 25))
        .toBeTruthy();
    expect(res.body.data.users
        .some((user: IUser) => user.phone === '+1 4801849392'))
        .toBeTruthy();
    expect(res.body.data.users.some((user: IUser) => user.isAdmin === true))
        .toBeTruthy();

    expect(res.body.data.users.some((user: IUser) => user.name === 'user2'))
        .toBeTruthy();
    expect(res.body.data.users
        .some((user: IUser) => user.email === 'user2@testing.com'))
        .toBeTruthy();
    expect(res.body.data.users.some((user: IUser) => user.age === 30))
        .toBeTruthy();
    expect(res.body.data.users
        .some((user: IUser) => user.phone === '+1 4801849377'))
        .toBeTruthy();
    expect(res.body.data.users.some((user: IUser) => user.isAdmin === false))
        .toBeTruthy();
  });
});

