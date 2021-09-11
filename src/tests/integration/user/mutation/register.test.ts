
import request from 'supertest';
import User from '../../../../db/models/UserModel';
import server from '../../../../app';

describe('Mutation: register', () => {
  let name: string;
  let email: string;
  let password: string;
  let age: number;
  let phone: string;
  let isAdmin: boolean;

  afterEach(async () => {
    await User.deleteMany({});
  });

  beforeEach(async () => {
    name = 'Tester user';
    email = 'user@testing.com';
    password = 'Test1234!';
    age = 20;
    phone = '+1 4801849392';
    isAdmin = false;
  });

  const exec = async () => {
    return await request(server).post('/graphql').send({
      query: `mutation {
        register(userInput: {
          name: "${name}",
          email: "${email}",
          password: "${password}",
          age: ${age},
          phone: "${phone}",
        }) {
          id
          name
          email
          age
          phone
          isAdmin
        }
      }`,
    });
  };

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

  it('should return an error if name is more than 50 characters',
      async () => {
        name = new Array(52).join('a');
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message).toContain('"name" length must be less' +
          ' than or equal to 50 characters long');
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
        email = 'email';
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message).toContain('"email" must be a valid email');
      },
  );

  it('should return an error if age is less than 8',
      async () => {
        age = 7;
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message)
            .toContain('"age" must be greater than or equal to 8');
      },
  );

  it('should return an error if phone is less than 5 characters',
      async () => {
        phone = '1234';
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message)
            .toContain('"phone" length must be at least 5 characters long');
      },
  );

  it('should return an error if phone is more than 20 characters',
      async () => {
        phone = new Array(22).join('1');
        const res = await exec();

        const message = res.body.errors.map(
            (err: Error) => err.message).join(', ');
        expect(message).toContain('"phone" length must be less' +
          ' than or equal to 20 characters long');
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
        expect(message).toContain([
          'Password must contain at least 8 characters',
          'and must include at least 1 lower-case letter,',
          '1 capital-case letter, 1 number, and 1 symbol.',
        ].join(' '));
      },
  );

  it('should save user if data is valid', async () => {
    await exec();

    const user = await User.find({name: name});
    expect(user).not.toBeNull();
  });

  it('should return user if data is valid', async () => {
    const res = await exec();

    expect(res.body.data.register).toHaveProperty('id');
    expect(res.body.data.register).toHaveProperty('name', name);
    expect(res.body.data.register).toHaveProperty('email', email);
    expect(res.body.data.register).toHaveProperty('age', age);
    expect(res.body.data.register).toHaveProperty('phone', phone);
    expect(res.body.data.register).toHaveProperty('isAdmin', isAdmin);
  });
});
