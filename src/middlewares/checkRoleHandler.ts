/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/httpError';
import { RoleType } from '@prisma/client';

const checkRoleHandler =
  (allowedRoles: RoleType[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any)?.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new HttpError(
        'Forbidden: You do not have permission to access this resource',
        403,
      );
    }
    next();
  };

export default checkRoleHandler;
