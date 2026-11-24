import { Router } from 'express';
import adminRoutes from './admin.routes';
import authRoutes from './auth.routes';
import bookRoutes from './book.routes';
import meRoutes from './me.routes';
import profileRoutes from './profile.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/books', bookRoutes);
router.use('/me', meRoutes);
router.use('/admin', adminRoutes);
router.use('/profile', profileRoutes);

export default router;
