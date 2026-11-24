import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import { USER_ROLES } from '../constants';
import { Book, User } from '../database/models';

export class UserController {
  static async getAll(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const users = await User.findAll({
        include: [
          {
            model: Book,
            as: 'books',
            attributes: ['id', 'name', 'author'],
          },
        ],
        order: [['id', 'ASC']],
      });

      res.json({ users });
    } catch (err) {
      next(err);
    }
  }

  static async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { name, email, password, role } = req.body;
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
        role: role ?? USER_ROLES.USER,
      });

      res.status(201).json({ user });
    } catch (err) {
      next(err);
    }
  }

  static async update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = Number(req.params.id);
      const { name, email, password, role } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        next(createError(404, 'User not found'));
        return;
      }

      if (email && email.toLowerCase() !== user.email) {
        const existingUser = await User.findOne({
          where: { email: email.toLowerCase() },
        });
        if (existingUser) {
          next(createError(409, 'User with this email already exists'));
          return;
        }
        user.email = email.toLowerCase();
      }

      if (name !== undefined) user.name = name;
      if (password !== undefined) user.password = password;
      if (role !== undefined) user.role = role;

      await user.save();
      res.json({ user });
    } catch (err) {
      next(err);
    }
  }

  static async delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = Number(req.params.id);

      if (userId === req.user!.id) {
        next(createError(400, 'You cannot delete your own admin account'));
        return;
      }

      const user = await User.findByPk(userId);
      if (!user) {
        next(createError(404, 'User not found'));
        return;
      }

      await user.destroy();
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
