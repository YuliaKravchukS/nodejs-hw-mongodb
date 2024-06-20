import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  const header = req.get('Authorization');
  if (!header) {
    return next(createHttpError(401, 'Please provide Authorization header'));
  }
  const bearer = header.split(' ')[0];
  const token = header.split(' ')[1];

  if (!bearer === 'Bearer' || !token) {
    return next(createHttpError(401, 'Auth header should be of type Bearer'));
  }
  const session = await SessionsCollection.findOne({ accessToken: token });

  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }
  if (new Date() > new Date(session.accessTokenValidUntil)) {
    return next(createHttpError(401, 'Access token expired'));
  }
  const user = await UsersCollection.findById(session.userId);
  if (!user) {
    return next(createHttpError(401));
  }
  req.user = user;

  return next();
};
