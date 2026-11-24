import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import { EXCHANGE_STATUS, ExchangeStatus } from '../constants';
import { Book, ExchangeRequest, User } from '../database/models';
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

  static async getIncomingRequests(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const requests = await ExchangeRequest.findAll({
        where: { ownerId: req.user!.id },
        include: [
          {
            model: Book,
            as: 'book',
            attributes: ['id', 'name', 'author', 'photo'],
          },
          {
            model: User,
            as: 'requester',
            attributes: ['id', 'name', 'email', 'avatar'],
            include: [
              {
                model: Book,
                as: 'books',
                attributes: ['id', 'name', 'author'],
              },
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      res.json({ requests });
    } catch (err) {
      next(err);
    }
  }

  static async updateRequestStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const requestId = Number(req.params.id);
      const { status } = req.body as { status: ExchangeStatus };

      const allowedStatuses: ExchangeStatus[] = [
        EXCHANGE_STATUS.ACCEPTED,
        EXCHANGE_STATUS.REJECTED,
      ];

      if (!allowedStatuses.includes(status)) {
        next(createError(400, 'Status must be accepted or rejected'));
        return;
      }

      const exchangeRequest = await ExchangeRequest.findByPk(requestId);
      if (!exchangeRequest) {
        next(createError(404, 'Exchange request not found'));
        return;
      }

      if (exchangeRequest.ownerId !== req.user!.id) {
        next(
          createError(
            403,
            'Forbidden: you can only manage requests for your own books',
          ),
        );
        return;
      }

      exchangeRequest.status = status;
      await exchangeRequest.save();

      res.json({ request: exchangeRequest });
    } catch (err) {
      next(err);
    }
  }
}
