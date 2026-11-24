import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { UserRole } from '../constants';
import { User } from '../database/models';

export interface JwtPayload {
  id: number;
  email: string;
  role: UserRole;
}

export const authMw = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    next(createError(401, 'Unauthorized: token missing'));
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const dbUser = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'email', 'role'],
    });

    if (!dbUser) {
      next(createError(401, 'User no longer exists'));
      return;
    }

    req.user = {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
    };

    next();
  } catch {
    next(createError(401, 'Invalid or expired token'));
  }
};
