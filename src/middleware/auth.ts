import jsonwebtoken from 'jsonwebtoken';
import config from 'config';

function decodeToken(token: string) {
  try {
    const payload = jsonwebtoken.verify(token, config.get('jwtPrivateKey'));
    return payload;
  } catch (error) {
    return null;
  }
}

function requiresAuth(token: string) {
  try {
    const payload = jsonwebtoken.verify(token, config.get('jwtPrivateKey'));
    return payload;
  } catch (error) {
    switch (error.message) {
      case 'invalid signature':
        // invalid signature (a complete but invalid token string)
        throw new Error('Invalid token');
      case 'jwt malformed':
        // jwt malformed (different structure; unexpected)
        throw new Error('Token is malformed');
      case 'jwt expired':
        throw new Error('Token has expired');
      default:
        // jwt must be provided (no token is provided)
        throw new Error('Requires authentication');
    }
  }
}

function requiresAdmin(token: string) {
  let isAdmin = false;
  try {
    const payload: any =
    jsonwebtoken.verify(token, config.get('jwtPrivateKey'));
    isAdmin = payload.isAdmin;
  } catch (error) {
    throw new Error('Invalid token');
  }
  if (!isAdmin) throw new Error('Action Denied');
}

export default (req: any, res: any, next: any) => {
  req.token = req.get('authorization')?.replace('Bearer ', '');
  // following the Single Responsibility Principle
  req.decodeToken = decodeToken;
  req.requiresAuth = requiresAuth;
  req.requiresAdmin = requiresAdmin;
  next();
};
