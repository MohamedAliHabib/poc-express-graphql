import IUser from './IUser';

interface IAuth {
    email: IUser['email'],
    password?: IUser['password'],
    name?: IUser['name'],
    age?: IUser['age'],
    phone?: IUser['phone'],
    isAdmin?: IUser['isAdmin'],
    accessToken?: string,
    refreshToken?: string,
}

export default IAuth;
