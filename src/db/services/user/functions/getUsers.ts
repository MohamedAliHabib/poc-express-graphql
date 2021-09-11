import IUser from '../../../interfaces/IUser';
import User from '../../../models/UserModel';

export async function getUsers(): Promise<Array<IUser>> {
  return await User.find().sort('name');
}
