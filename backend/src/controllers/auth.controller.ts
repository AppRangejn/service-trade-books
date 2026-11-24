import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { USER_ROLES } from '../constants';
import { User } from '../database/models';
import { sendPasswordResetEmail } from '../services/mail.service';
import { signAccessToken } from '../utils/jwt';

interface PasswordResetPayload {
  userId: number;
  purpose: 'password-reset';
}

export class AuthController {
  static async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { name, email, password } = req.body;
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
        role: USER_ROLES.USER,
      });

      const token = signAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      res.status(201).json({ user, token });
    } catch (err) {
      next(err);
    }
  }

  static async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const normalizedEmail = email.toLowerCase();

      const user = await User.findOne({ where: { email: normalizedEmail } });
      if (!user || !(await user.comparePassword(password))) {
        next(createError(401, 'Invalid email or password'));
        return;
      }

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

  static async getMe(
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

      res.json({ user });
    } catch (err) {
      next(err);
    }
  }

  static async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const normalizedEmail = req.body.email.toLowerCase();
      const user = await User.findOne({ where: { email: normalizedEmail } });

      if (!user) {
        res.json({
          message:
            'If an account with that email exists, a password reset email has been sent.',
        });
        return;
      }

      const resetSecret = `${process.env.JWT_SECRET!}:${user.password}`;
      const resetToken = jwt.sign(
        {
          userId: user.id,
          purpose: 'password-reset',
        } satisfies PasswordResetPayload,
        resetSecret,
        { expiresIn: '15m' },
      );

      const clientUrl = (process.env.CLIENT_URL || 'http://localhost:3000')
        .split(',')[0]
        .trim();
      const resetUrl = `${clientUrl}/forgot-password?token=${encodeURIComponent(resetToken)}`;

      const previewUrl = await sendPasswordResetEmail({
        toEmail: user.email,
        toName: user.name,
        resetUrl,
        resetToken,
      });

      res.json({
        message:
          'If an account with that email exists, a password reset email has been sent.',
        ...(previewUrl ? { previewUrl } : {}),
      });
    } catch (err) {
      next(err);
    }
  }

  static async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { token, newPassword } = req.body;

      const unverified = jwt.decode(token) as PasswordResetPayload | null;
      if (
        !unverified ||
        unverified.purpose !== 'password-reset' ||
        !unverified.userId
      ) {
        next(createError(400, 'Invalid reset token'));
        return;
      }

      const user = await User.findByPk(unverified.userId);
      if (!user) {
        next(createError(404, 'User not found'));
        return;
      }

      const resetSecret = `${process.env.JWT_SECRET!}:${user.password}`;
      try {
        jwt.verify(token, resetSecret);
      } catch {
        next(createError(400, 'Invalid or expired reset token'));
        return;
      }

      user.password = newPassword;
      await user.save();

      res.json({ message: 'Password has been reset successfully' });
    } catch (err) {
      next(err);
    }
  }
}
