import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { usersSchema } from '../validation/user.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserController } from '../controllers/auth.js';

const routerAuth = Router();

routerAuth.post(
  '/register',
  validateBody(usersSchema),
  ctrlWrapper(registerUserController),
);
// routerAuth.post();
// routerAuth.post();
// routerAuth.post();

export default routerAuth;
