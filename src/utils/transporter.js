import nodemiler from 'nodemailer';
import { env } from './env.js';
import { ENV_VAR } from '../constants/index.js';

const transporter = nodemiler.createTransport({
  host: env(ENV_VAR.SMTP_HOST),
  port: Number(env(ENV_VAR.SMTP_PORT)),
  auth: {
    user: env(ENV_VAR.SMTP_USER),
    pass: env(ENV_VAR.SMTP_PASSWORD),
  },
});

export const sendEmail = async (options) => {
  return await transporter.sendMail(options);
};
