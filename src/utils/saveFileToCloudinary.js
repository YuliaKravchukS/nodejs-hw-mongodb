import cloudinary from 'cloudinary';
import { env } from './env.js';
import { ENV_VAR } from '../constants/index.js';

cloudinary.config({
  secure: true,
  cloud_name: env(ENV_VAR.CLOUD_NAME),
  api_key: env(ENV_VAR.CLOUD_API_KEY),
  api_secret: env(ENV_VAR.CLOUD_API_SECRET),
});

export const saveFileToCloudinary = async (file) => {
  const response = await cloudinary.v2.uploader.upload(file.path);
  return response.secure_url;
};
