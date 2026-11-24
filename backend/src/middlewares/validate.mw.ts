import { NextFunction, Request, Response } from 'express';
import { AnyObjectSchema } from 'yup';

export const validate =
  (schema: AnyObjectSchema) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = await schema.validate(
        {
          body: req.body,
          query: req.query,
          params: req.params,
        },
        {
          abortEarly: false,
          stripUnknown: true,
        },
      );

      if (validated.body) req.body = validated.body;
      if (validated.params) Object.assign(req.params, validated.params);
      if (validated.query) Object.assign(req.query, validated.query);

      next();
    } catch (err) {
      next(err);
    }
  };
