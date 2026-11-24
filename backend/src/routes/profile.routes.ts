import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { authMw } from '../middlewares/auth.mw';
import { validate } from '../middlewares/validate.mw';
import { updateProfileSchema } from '../validations/auth.validation';

const router = Router();

router.use(authMw);

router.get('/', ProfileController.getProfile);
router.patch(
  '/',
  validate(updateProfileSchema),
  ProfileController.updateProfile,
);

export default router;
