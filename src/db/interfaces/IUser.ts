import {Document} from 'mongoose';


interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    age: number,
    phone: string,
    isAdmin: boolean,
    generateAuthToken(): string,
    generateAuthRefToken(): string,
}

export default IUser;
