/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/httpError';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ message: err.message });
  }
  if (err instanceof Error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
  res.status(500).json({ message: 'Internal Server Error' });
};
