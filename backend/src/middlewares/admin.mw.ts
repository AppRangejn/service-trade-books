import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import { USER_ROLES } from '../constants';

export const adminMw = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  if (req.user?.role !== USER_ROLES.ADMIN) {
    next(createError(403, 'Forbidden: admin access required'));
    return;
  }
  next();
};
