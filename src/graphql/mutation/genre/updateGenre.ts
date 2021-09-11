import {GraphQLNonNull, GraphQLString, GraphQLID} from 'graphql';
import GenreType from '../../type/genre/genre';
import {updateGenre} from '../../../db/services/genre/GenreService';
import IGenre from '../../../db/interfaces/IGenre';
import Joi from 'joi';

export default {
  type: GenreType,
  args: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    name: {type: new GraphQLNonNull(GraphQLString)},
  },
  resolve(parent: any, args: any, req: any):
  Promise<IGenre | Joi.ValidationError> {
    // busienss logic rules should be here?
    req.requiresAuth(req.token);
    req.requiresAdmin(req.token);
    return updateGenre(args);
  },
};
