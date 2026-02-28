import { Request, Response } from 'express';
import { ErrorApiResponse, HttpStatusCode } from '../types/apiType';

export const notFoundHandler = (
  req: Request,
  res: Response<ErrorApiResponse>,
) => {
  res.status(HttpStatusCode.NOT_FOUND).json({
    success: false,
    message: 'Resource not found',
    statusCode: HttpStatusCode.NOT_FOUND,
    code: HttpStatusCode.NOT_FOUND.toString(),
  });
};
