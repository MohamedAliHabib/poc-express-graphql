import IAuth from './IAuth';

interface IRefreshAuthOutput {
    accessToken: IAuth['accessToken'],
    refreshToken: IAuth['refreshToken'],
}

export default IRefreshAuthOutput;
