/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/httpError';
import { ErrorApiResponse, HttpStatusCode } from '../types/apiType';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response<ErrorApiResponse | void>,
  next: NextFunction,
) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      statusCode: err.statusCode,
      code: err.statusCode.toString(),
      detail: err.detail,
    });
  }

  if (err instanceof Error) {
    const payload: any = {
      success: false,
      message: 'Internal Server Error',
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      code: HttpStatusCode.INTERNAL_SERVER_ERROR.toString(),
    };
    if (process.env.NODE_ENV !== 'production') {
      payload.detail = err.message;
      payload.stack = err.stack;
    }
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(payload);
  }

  return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Internal Server Error',
    statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    code: HttpStatusCode.INTERNAL_SERVER_ERROR.toString(),
  });
};
