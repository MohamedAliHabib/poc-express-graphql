import {GraphQLID} from 'graphql';
import _ from 'lodash';
import GenreType from '../../type/genre/genre';
import {getGenre} from '../../../db/services/genre/GenreService';
import IGenre from '../../../db/interfaces/IGenre';

export default {
  type: GenreType,
  args: {id: {type: GraphQLID}},
  resolve(parent: any, args: any): Promise<IGenre> {
    return getGenre(args.id);
  },
};
