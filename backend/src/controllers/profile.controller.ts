import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import { Book, User } from '../database/models';
import { signAccessToken } from '../utils/jwt';

export class ProfileController {
  static async getProfile(
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

      const booksCount = await Book.count({ where: { userId: user.id } });

      res.json({ user, booksCount });
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { name, email, avatar } = req.body;
      const user = await User.findByPk(req.user!.id);

      if (!user) {
        next(createError(404, 'User not found'));
        return;
      }

      if (email && email.toLowerCase() !== user.email) {
        const normalizedEmail = email.toLowerCase();
        const existingUser = await User.findOne({
          where: { email: normalizedEmail },
        });
        if (existingUser) {
          next(createError(409, 'User with this email already exists'));
          return;
        }
        user.email = normalizedEmail;
      }

      if (name !== undefined) user.name = name;
      if (avatar !== undefined) user.avatar = avatar || null;

      await user.save();

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
}
