import {GraphQLList} from 'graphql';
import GenreType from '../../type/genre/genre';
import {getGenres} from '../../../db/services/genre/GenreService';
import IGenre from '../../../db/interfaces/IGenre';

const genres = {
  type: new GraphQLList(GenreType),
  resolve(parent: any, args: any):Promise<Array<IGenre>> {
    return getGenres();
  },
};

export default genres;
