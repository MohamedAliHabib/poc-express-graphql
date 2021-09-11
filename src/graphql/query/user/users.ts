import {GraphQLList} from 'graphql';
import UserType from '../../type/user/user';
import {getUsers} from '../../../db/services/user/UserService';
import IUser from '../../../db/interfaces/IUser';

const users = {
  type: new GraphQLList(UserType),
  resolve(parent: any, args: any, req: any): Promise<Array<IUser>> {
    req.requiresAuth(req.token);
    req.requiresAdmin(req.token);
    return getUsers();
  },
};

export default users;
