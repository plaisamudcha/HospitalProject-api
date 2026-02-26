/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/httpError';
import jwt from 'jsonwebtoken';
import { envConfig } from '../config/config';
import { UserPayload } from '../types/authType';

export const authenticateHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const [bearer, token] = req.headers.authorization?.split(' ') || [];

  if (bearer !== 'Bearer' || !token) {
    throw new HttpError('Unauthorized', 401);
  }
  try {
    const payload = jwt.verify(token, envConfig.JWT_SECRET) as UserPayload;
    (req as any).user = payload;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new HttpError('Invalid token', 401);
    }
    throw new HttpError('Unauthorized', 401);
  }
};
