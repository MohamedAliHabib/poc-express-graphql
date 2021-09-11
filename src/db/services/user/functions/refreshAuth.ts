import User from '../../../models/UserModel';
import config from 'config';
import jsonwebtoken from 'jsonwebtoken';
import IRefreshAuthOutput from '../../../interfaces/IRefreshAuthOutput';


const validateToken = (token: string): any => {
  return jsonwebtoken.verify(token,
      config.get('jwtPrivateKey'));
};

const extractPayload = (token: string): any => {
  return jsonwebtoken.verify(
      token,
      config.get('jwtPrivateKey'),
      {ignoreExpiration: true},
  );
};

export async function refreshAuth(
    accessToken: string, refreshToken: string): Promise<IRefreshAuthOutput> {
  if (!accessToken || !refreshToken) {
    throw new Error(
        'Values must be provided for both accessToken and refresh token.',
    );
  }

  let userId = -1;
  let isAccessTokenValid = false;
  try {
    const {_id} = validateToken(accessToken);
    if (_id) isAccessTokenValid = true;
  } catch (error) {
    const {_id} = extractPayload(accessToken);
    userId = _id;
  }
  if (isAccessTokenValid) throw new Error('Access token is still valid');

  try {
    validateToken(refreshToken);
  } catch (error) {
    throw new Error('Invalid refresh token.');
  }

  const {_id} = extractPayload(refreshToken);
  if (userId !== _id) {
    throw new Error('Access and refresh tokens must be for the same user');
  }

  const user = await User.findOne({_id: userId});
  if (!user) throw new Error('Could not find user.');

  const newToken = user.generateAuthToken();
  const newRefreshToken = user.generateAuthRefToken();

  return {
    accessToken: newToken,
    refreshToken: newRefreshToken,
  };
}
