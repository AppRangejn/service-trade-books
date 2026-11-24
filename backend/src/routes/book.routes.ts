import { Router } from 'express';
import { BookController } from '../controllers/book.controller';
import { authMw } from '../middlewares/auth.mw';
import { validate } from '../middlewares/validate.mw';
import {
  bookIdParamSchema,
  createBookSchema,
  getBooksQuerySchema,
  updateBookSchema,
} from '../validations/book.validation';

const router = Router();

router.get('/', validate(getBooksQuerySchema), BookController.getAll);
router.get('/:id', validate(bookIdParamSchema), BookController.getById);
router.post('/', authMw, validate(createBookSchema), BookController.create);
router.patch('/:id', authMw, validate(updateBookSchema), BookController.update);
router.delete(
  '/:id',
  authMw,
  validate(bookIdParamSchema),
  BookController.delete,
);
router.post(
  '/:id/exchange',
  authMw,
  validate(bookIdParamSchema),
  BookController.requestExchange,
);

export default router;
