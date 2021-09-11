import {GraphQLID} from 'graphql';
import UserType from '../../type/user/user';
import {getUser} from '../../../db/services/user/UserService';
import IUser from '../../../db/interfaces/IUser';

export default {
  type: UserType,
  args: {id: {type: GraphQLID}},
  resolve(parent: any, args: any, req: any): Promise<IUser> {
    req.requiresAuth(req.token);
    req.requiresAdmin(req.token);
    return getUser(args.id);
  },
};
