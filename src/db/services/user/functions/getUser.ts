import {Types} from 'mongoose';
import IUser from '../../../interfaces/IUser';
import User from '../../../models/UserModel';
import validateID from '../../../validators/IDValidator';

export async function getUser(id: Types.ObjectId): Promise<IUser> {
  validateID(id);
  const user: IUser | null = await User.findById(id);
  if (!user) throw new Error('Could not find user for given id');
  return user;
}
