import {Document} from 'mongoose';

interface IGenre extends Document {
    name: string,
}

export default IGenre;
