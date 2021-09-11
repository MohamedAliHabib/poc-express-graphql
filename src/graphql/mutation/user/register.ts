import IUser from '../../../db/interfaces/IUser';
import UserType from '../../type/user/user';
import {createUser} from '../../../db/services/user/UserService';
import userInput from '../input/userInput';
import {ValidationError} from 'joi';

export default {
  type: UserType,
  args: {userInput: {type: userInput}},
  resolve(parent: any, args: any): Promise<ValidationError | IUser> {
    return createUser(args.userInput);
  },
};
