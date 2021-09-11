import {GraphQLNonNull, GraphQLString} from 'graphql';
import AuthType from '../../type/user/auth';
import {authUser, refreshAuth} from '../../../db/services/user/UserService';
import authInput from '../input/authInput';
import Joi from 'joi';
import IAuthUserOutput from '../../../db/interfaces/IAuthUserOutput';
import IRefreshAuthOutput from '../../../db/interfaces/IRefreshAuthOutput';

export const login = {
  type: AuthType, // return type
  args: {authInput: {type: authInput}},
  resolve(parent: any, args: any, req: any):
  Promise<IAuthUserOutput | Joi.ValidationError> {
    return authUser(args.authInput);
  },
};

export const renewToken = {
  type: AuthType,
  args: {
    accessToken: {type: new GraphQLNonNull(GraphQLString)},
    refreshToken: {type: new GraphQLNonNull(GraphQLString)},
  },
  resolve(parent: any, args: any, req: any): Promise<IRefreshAuthOutput> {
    return refreshAuth(args.accessToken, args.refreshToken);
  },
};
