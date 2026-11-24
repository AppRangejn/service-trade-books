import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import { Op } from 'sequelize';
import { PAGINATION, SORT_ORDER, SortOrder, USER_ROLES } from '../constants';
import { Book, User } from '../database/models';
import { sendExchangeRequestEmail } from '../services/mail.service';

export class BookController {
  static async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const query = (req.validatedQuery ?? req.query) as {
        search?: string;
        sort?: SortOrder;
        page?: number;
        limit?: number;
      };

      const page = Number(query.page) || PAGINATION.DEFAULT_PAGE;
      const limit = Math.min(
        Number(query.limit) || PAGINATION.DEFAULT_LIMIT,
        PAGINATION.MAX_LIMIT,
      );
      const offset = (page - 1) * limit;
      const sortOrder: SortOrder =
        query.sort === SORT_ORDER.DESC ? SORT_ORDER.DESC : SORT_ORDER.ASC;
      const search = query.search?.trim();

      const where = search
        ? {
            [Op.or]: [
              { name: { [Op.iLike]: `%${search}%` } },
              { author: { [Op.iLike]: `%${search}%` } },
            ],
          }
        : undefined;

      const { rows: books, count: total } = await Book.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'owner',
            attributes: ['id', 'name'],
          },
        ],
        order: [
          ['name', sortOrder],
          ['id', 'ASC'],
        ],
        limit,
        offset,
      });

      res.json({
        books,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const bookId = Number(req.params.id);

      const book = await Book.findByPk(bookId, {
        include: [
          {
            model: User,
            as: 'owner',
            attributes: ['id', 'name'],
          },
        ],
      });

      if (!book) {
        next(createError(404, 'Book not found'));
        return;
      }

      res.json({ book });
    } catch (err) {
      next(err);
    }
  }

  static async getMyBooks(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const books = await Book.findAll({
        where: { userId: req.user!.id },
        order: [['createdAt', 'DESC']],
      });

      res.json({ books });
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
      const { name, author, photo } = req.body;

      const book = await Book.create({
        name,
        author,
        photo: photo ?? null,
        userId: req.user!.id,
      });

      res.status(201).json({ book });
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
      const bookId = Number(req.params.id);
      const book = await Book.findByPk(bookId);

      if (!book) {
        next(createError(404, 'Book not found'));
        return;
      }

      const isOwner = book.userId === req.user!.id;
      const isAdmin = req.user!.role === USER_ROLES.ADMIN;

      if (!isOwner && !isAdmin) {
        next(createError(403, 'Forbidden: you can only edit your own books'));
        return;
      }

      const { name, author, photo } = req.body;

      if (name !== undefined) book.name = name;
      if (author !== undefined) book.author = author;
      if (photo !== undefined) book.photo = photo;

      await book.save();

      res.json({ book });
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
      const bookId = Number(req.params.id);
      const book = await Book.findByPk(bookId);

      if (!book) {
        next(createError(404, 'Book not found'));
        return;
      }

      const isOwner = book.userId === req.user!.id;
      const isAdmin = req.user!.role === USER_ROLES.ADMIN;

      if (!isOwner && !isAdmin) {
        next(createError(403, 'Forbidden: you can only delete your own books'));
        return;
      }

      await book.destroy();
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  static async requestExchange(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const bookId = Number(req.params.id);
      const sender = req.user!;

      const book = await Book.findByPk(bookId, {
        include: [
          {
            model: User,
            as: 'owner',
            attributes: ['id', 'name', 'email'],
          },
        ],
      });

      if (!book) {
        next(createError(404, 'Book not found'));
        return;
      }

      if (book.userId === sender.id) {
        next(
          createError(400, 'You cannot request an exchange for your own book'),
        );
        return;
      }

      const owner = (book as Book & { owner?: User }).owner;
      if (!owner) {
        next(createError(404, 'Book owner not found'));
        return;
      }

      const senderBooks = await Book.findAll({
        where: { userId: sender.id },
        attributes: ['name', 'author'],
        order: [['name', 'ASC']],
      });

      const previewUrl = await sendExchangeRequestEmail({
        toEmail: owner.email,
        toName: owner.name,
        requestedBookTitle: book.name,
        senderName: sender.name,
        senderEmail: sender.email,
        senderBooks: senderBooks.map((b) => ({
          name: b.name,
          author: b.author,
        })),
      });

      res.json({
        message: 'Exchange request email sent successfully',
        ...(previewUrl ? { previewUrl } : {}),
      });
    } catch (err) {
      next(err);
    }
  }
}
