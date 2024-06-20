import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});
