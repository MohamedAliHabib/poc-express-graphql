import {Document, Types} from 'mongoose';

interface IMovie extends Document {
    name: string,
    genreId: Types.ObjectId,
    numberInStock: number,
    dailyRentalRate: number,
}

export default IMovie;
