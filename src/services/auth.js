import { UsersCollection } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';

const fifteen_min = 1000 * 60 * 15;
export const one_month = 1000 * 60 * 60 * 24 * 30;

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + fifteen_min),
    refreshTokenValidUntil: new Date(Date.now() + one_month),
  };
};

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');
  const hashPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: hashPassword,
  });
};

export const loginUser = async ({ email, password }) => {
  const user = await UsersCollection.findOne({ email });

  if (!user) throw createHttpError(404, 'User not found');

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) throw createHttpError(401, 'Unauthorized');

  await SessionsCollection.deleteOne({ userId: user._id });

  return await SessionsCollection.create({
    userId: user._id,
    ...createSession(),
  });
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > new Date(session.refreshTokenValidUntil)) {
    throw createHttpError(401, 'Session refreshToken expired');
  }

  const newSession = createSession();

  await SessionsCollection.deleteOne({ _id: sessionId });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};
