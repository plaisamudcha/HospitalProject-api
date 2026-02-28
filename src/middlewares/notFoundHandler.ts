import { Request, Response } from 'express';
import { HttpStatusCode } from '../types/apiType';

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Not Found' });
};
