import {
  loginUser,
  logoutUser,
  one_month,
  refreshUsersSession,
  registerUser,
} from '../services/auth.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};
const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + one_month),
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + one_month),
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  setupSession(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
};

export const logoutUserController = async (req, res) => {
  await logoutUser(req.cookies.sessionId);

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

export const refreshUserController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: session.accessToken },
  });
};
