import Joi from 'joi';

export const usersSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});
