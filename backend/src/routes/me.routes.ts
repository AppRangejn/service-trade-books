import { Router } from 'express';
import { BookController } from '../controllers/book.controller';
import { authMw } from '../middlewares/auth.mw';
import { validate } from '../middlewares/validate.mw';
import { createBookSchema } from '../validations/book.validation';

const router = Router();

router.use(authMw);

router.get('/books', BookController.getMyBooks);
router.post('/books', validate(createBookSchema), BookController.create);

export default router;
