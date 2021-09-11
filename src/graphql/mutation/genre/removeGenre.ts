import {GraphQLNonNull, GraphQLString, GraphQLID} from 'graphql';
import GenreType from '../../type/genre/genre';
import {removeGenre} from '../../../db/services/genre/GenreService';
import IGenre from '../../../db/interfaces/IGenre';

export default {
  type: GenreType,
  args: {
    id: {type: new GraphQLNonNull(GraphQLID)},
  },
  resolve(parent: any, args: any, req: any): Promise<IGenre> {
    req.requiresAuth(req.token);
    req.requiresAdmin(req.token);
    return removeGenre(args.id);
  },
};
