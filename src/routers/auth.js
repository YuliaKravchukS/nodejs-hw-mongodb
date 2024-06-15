import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { usersSchema } from '../validation/user.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  registerUserController,
  loginUserController,
  logoutUserController,
} from '../controllers/auth.js';
import { loginSchema } from '../validation/login.js';

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
routerAuth.post('/logout', ctrlWrapper(logoutUserController));
// routerAuth.post();

export default routerAuth;
