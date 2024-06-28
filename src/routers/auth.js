import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { usersSchema } from '../validation/user.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshUserController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';
import { loginSchema } from '../validation/login.js';
import { authenticate } from '../middlewares/authenticate.js';
import { requestResetEmailSchema } from '../validation/requestResetEmail.js';
import { resetPasswordSchema } from '../validation/resetPasswordSchema.js';

const routerAuth = Router();

routerAuth.post(
  '/register',
  validateBody(usersSchema),
  ctrlWrapper(registerUserController),
);

routerAuth.post(
  '/login',
  validateBody(loginSchema),
  ctrlWrapper(loginUserController),
);

routerAuth.post('/logout', authenticate, ctrlWrapper(logoutUserController));

routerAuth.post('/refresh', authenticate, ctrlWrapper(refreshUserController));

routerAuth.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

routerAuth.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default routerAuth;
