import User from '../../../models/UserModel';
import IUser from '../../../interfaces/IUser';
import validateAuth from '../../../validators/AuthValidator';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import IAuthUserOutput from '../../../interfaces/IAuthUserOutput';
import Joi from 'joi';

export async function authUser(data: IUser):
  Promise<IAuthUserOutput | Joi.ValidationError> {
  const {error} = validateAuth(data);
  if (error) return error;

  const user: IUser | null = await User.findOne({email: data.email});
  if (!user) throw new Error('Invalid email or password.');

  const validPassword = await bcrypt.compare(data.password, user.password);
  if (!validPassword) throw new Error('Invalid email or password.');

  const token = user.generateAuthToken();
  const refreshToken = user.generateAuthRefToken();

  // user = _.pick(user, ['id', 'name', 'email', 'age', 'phone']);
  return {
    // ...user,
    id: user.id,
    ..._.pick(user, ['name', 'email', 'age', 'phone']),
    accessToken: token,
    refreshToken: refreshToken,
  };
}
