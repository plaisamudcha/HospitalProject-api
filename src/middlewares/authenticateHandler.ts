/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/httpError';
import jwt from 'jsonwebtoken';
import { HttpStatusCode } from '../types/apiType';
import jwtToken from '../utils/jwtToken';

export const authenticateHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const [bearer, token] = req.headers.authorization?.split(' ') || [];

  if (bearer !== 'Bearer' || !token) {
    throw new HttpError('Unauthorized', HttpStatusCode.UNAUTHORIZED);
  }
  try {
    const payload = jwtToken.verifyToken(token);
    (req as any).user = payload;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new HttpError('Invalid token', HttpStatusCode.UNAUTHORIZED);
    }
    throw new HttpError('Unauthorized', HttpStatusCode.UNAUTHORIZED);
  }
};
