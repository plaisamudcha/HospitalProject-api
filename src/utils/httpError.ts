/* eslint-disable @typescript-eslint/no-explicit-any */
export class HttpError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public detail?: any,
  ) {
    super(message);
  }
}
