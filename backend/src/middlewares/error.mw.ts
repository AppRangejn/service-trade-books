import { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';
import {
  ValidationError as SequelizeValidationError,
  UniqueConstraintError,
} from 'sequelize';
import { ValidationError as YupValidationError } from 'yup';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (res.headersSent) {
    return;
  }

  if (err instanceof SyntaxError && 'status' in err && err.status === 400) {
    res.status(400).json({ message: 'Invalid JSON body' });
    return;
  }

  if (err instanceof YupValidationError) {
    res.status(400).json({
      message: 'Validation error',
      errors: err.errors,
    });
    return;
  }

  if (err instanceof UniqueConstraintError) {
    res.status(409).json({
      message: err.errors[0]?.message || 'Record already exists',
    });
    return;
  }

  if (err instanceof SequelizeValidationError) {
    res.status(400).json({
      message: 'Database validation error',
      errors: err.errors.map((e) => e.message),
    });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      message: err.message,
    });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    message: 'Internal Server Error',
  });
};
