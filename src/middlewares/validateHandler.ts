import { NextFunction, Request, Response } from 'express';
import z, { ZodType } from 'zod';
import { HttpError } from '../utils/httpError';

export const validateHandler =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const { success, data, error } = schema.safeParse(req.body);
    if (!success) {
      throw new HttpError('Validation error', 400, z.flattenError(error));
    }
    req.body = data;
    next();
  };
