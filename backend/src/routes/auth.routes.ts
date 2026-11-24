import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMw } from '../middlewares/auth.mw';
import { validate } from '../middlewares/validate.mw';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from '../validations/auth.validation';    

const router = Router();

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.get('/me', authMw, AuthController.getMe);
router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  AuthController.forgotPassword,
);
router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  AuthController.resetPassword,
);

export default router;
