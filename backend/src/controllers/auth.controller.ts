import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import { USER_ROLES } from '../constants';
import { User } from '../database/models';
import { signAccessToken } from '../utils/jwt';

export class AuthController {
  static async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const normalizedEmail = email.toLowerCase();

      const existingUser = await User.findOne({
        where: { email: normalizedEmail },
      });
      if (existingUser) {
        next(createError(409, 'User with this email already exists'));
        return;
      }

      const user = await User.create({
        name,
        email: normalizedEmail,
        password,
        role: USER_ROLES.USER,
      });

      const token = signAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      res.status(201).json({ user, token });
    } catch (err) {
      next(err);
    }
  }

  static async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const normalizedEmail = email.toLowerCase();

      const user = await User.findOne({ where: { email: normalizedEmail } });
      if (!user || !(await user.comparePassword(password))) {
        next(createError(401, 'Invalid email or password'));
        return;
      }

      const token = signAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      res.json({ user, token });
    } catch (err) {
      next(err);
    }
  }

  static async getMe(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await User.findByPk(req.user!.id);
      if (!user) {
        next(createError(404, 'User not found'));
        return;
      }

      res.json({ user });
    } catch (err) {
      next(err);
    }
  }
}
