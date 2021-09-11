import {GraphQLString, GraphQLNonNull} from 'graphql';
import GenreType from '../../type/genre/genre';
import {createGenre} from '../../../db/services/genre/GenreService';
import IGenre from '../../../db/interfaces/IGenre';
import Joi from 'joi';

export default {
  type: GenreType,
  args: {name: {type: new GraphQLNonNull(GraphQLString)}},
  resolve(parent: any, args: any, req: any):
  Promise<IGenre | Joi.ValidationError> {
    req.requiresAuth(req.token);
    return createGenre(args);
  },
};
