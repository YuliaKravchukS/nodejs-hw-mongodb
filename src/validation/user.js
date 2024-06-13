// //     name - string, required
// // email - string, email, unique, required
// // password - string, required
// // createdAt - дата створення
// // updatedAt - дата оновлення

import Joi from 'joi';

export const usersSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});
