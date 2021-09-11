import IAuth from './IAuth';
import IUser from './IUser';

interface IAuthUserOutput {
    id: IUser['id'],
    name: IUser['name'],
    email: IUser['email'],
    age: IUser['age'],
    phone: IUser['phone'],
    accessToken: IAuth['accessToken'],
    refreshToken: IAuth['refreshToken'],
}

export default IAuthUserOutput;
