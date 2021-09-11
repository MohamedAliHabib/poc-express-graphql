import User from '../../../models/UserModel';
import IUser from '../../../interfaces/IUser';
import validate from '../../../validators/UserValidator';
import validatePassword from '../../../validators/PasswordValidator';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import Joi from 'joi';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function createUser(data: IUser):
  Promise<IUser | Joi.ValidationError> {
  const {error} = validate(data);
  if (error) return error;
  validatePassword(data.password);

  // lookup if user exists
  let user: IUser | null = await User.findOne({email: data.email});
  if (user) throw new Error('User already registered.');

  data.isAdmin = false; // default
  user = new User(
      _.pick(data, ['name', 'email', 'password', 'age', 'phone', 'isAdmin']),
  );

  user.password = await hashPassword(user.password);

  await user.save();

  return user;
}
