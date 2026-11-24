import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { adminMw } from '../middlewares/admin.mw';
import { authMw } from '../middlewares/auth.mw';
import { validate } from '../middlewares/validate.mw';
import {
  createUserByAdminSchema,
  updateUserByAdminSchema,
  userIdParamSchema,
} from '../validations/user.validation';

const router = Router();

router.use(authMw, adminMw);

router.get('/users', UserController.getAll);
router.post('/users', validate(createUserByAdminSchema), UserController.create);
router.patch(
  '/users/:id',
  validate(updateUserByAdminSchema),
  UserController.update,
);
router.delete('/users/:id', validate(userIdParamSchema), UserController.delete);

export default router;
