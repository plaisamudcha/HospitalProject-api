import { NextFunction, Request, Response } from 'express';
import z, { ZodType } from 'zod';
import { HttpError } from '../utils/httpError';
import { HttpStatusCode } from '../types/apiType';

export const validateHandler =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const { success, data, error } = schema.safeParse(req.body);
    if (!success) {
      throw new HttpError(
        'Validation error',
        HttpStatusCode.BAD_REQUEST,
        z.flattenError(error),
      );
    }
    req.body = data;
    next();
  };
