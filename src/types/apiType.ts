/* eslint-disable @typescript-eslint/no-explicit-any */
export type SuccessApiResponse<T = void> = T extends void
  ? {
      success: true;
      message?: string;
    }
  : {
      success: true;
      message?: string;
      data: T;
    };

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export type ErrorApiResponse = {
  success: false;
  message: string;
  statusCode: HttpStatusCode;
  code: string;
  detail?: any;
};

export type ApiResponse<T = void> = SuccessApiResponse<T> | ErrorApiResponse;
