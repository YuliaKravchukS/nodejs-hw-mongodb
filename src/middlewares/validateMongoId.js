import createHttpError from 'http-errors';
import mongoose from 'mongoose';

export const validateMongoId = (idName) => (req, res, next) => {
  const id = req.params[idName];

  if (!mongoose.isValidObjectId(id)) {
    return next(createHttpError(400, 'Invalid Id format'));
  }
  return next();
};
