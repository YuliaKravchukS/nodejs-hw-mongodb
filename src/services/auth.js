import { UsersCollection } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';
import jwt from 'jsonwebtoken';
import { ENV_VAR } from '../constants/index.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/transporter.js';
import { error } from 'console';

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

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    if (!user) throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env(ENV_VAR.JWT_SECRET),
    {
      expiresIn: '5m',
    },
  );
  try {
    await sendEmail({
      from: env(ENV_VAR.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${env(
        ENV_VAR.APP_DOMAIN,
      )}/reset-password?token=${resetToken}">here</a> to reset your password!</p>`,
    });
  } catch (error) {
    console.log(error);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async ({ token, password }) => {
  let tokenPayload;
  try {
    tokenPayload = jwt.verify(token, env(ENV_VAR.JWT_SECRET));
  } catch (error) {
    throw createHttpError(401, error.message);
  }

  const user = await UsersCollection.findOne({
    _id: tokenPayload.sub,
    email: tokenPayload.email,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  await UsersCollection.findOneAndUpdate(
    {
      _id: tokenPayload.sub,
      email: tokenPayload.email,
    },
    {
      password: hashPassword,
    },
  );
};
