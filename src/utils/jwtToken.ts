import jwt from 'jsonwebtoken';
import { UserPayload } from '../types/authType';
import { envConfig } from '../config/config';
import { HttpError } from './httpError';
import { HttpStatusCode } from '../types/apiType';

const jwtToken = {
  generateToken: (payload: UserPayload): string => {
    return jwt.sign(payload, envConfig.JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: '1h',
    });
  },
  generateRefreshToken: (payload: UserPayload): string => {
    return jwt.sign(payload, envConfig.JWT_REFRESH_SECRET, {
      algorithm: 'HS256',
      expiresIn: '30d',
    });
  },
  generateResetPasswordToken: (payload: UserPayload): string => {
    return jwt.sign(payload, envConfig.JWT_RESET_PASSWORD_SECRET, {
      algorithm: 'HS256',
      expiresIn: '15m',
    });
  },
  verifyToken: (token: string): UserPayload => {
    try {
      return jwt.verify(token, envConfig.JWT_SECRET, {
        algorithms: ['HS256'],
      }) as UserPayload;
    } catch (err) {
      throw new HttpError(
        err instanceof Error ? err.message : 'Invalid token',
        HttpStatusCode.UNAUTHORIZED,
      );
    }
  },
  verifyRefreshToken: (token: string): UserPayload => {
    try {
      return jwt.verify(token, envConfig.JWT_REFRESH_SECRET, {
        algorithms: ['HS256'],
      }) as UserPayload;
    } catch (err) {
      throw new HttpError(
        err instanceof Error ? err.message : 'Invalid refresh token',
        HttpStatusCode.UNAUTHORIZED,
      );
    }
  },
  verifyResetPasswordToken: (token: string): UserPayload => {
    try {
      return jwt.verify(token, envConfig.JWT_RESET_PASSWORD_SECRET, {
        algorithms: ['HS256'],
      }) as UserPayload;
    } catch (err) {
      throw new HttpError(
        err instanceof Error ? err.message : 'Invalid reset password token',
        HttpStatusCode.UNAUTHORIZED,
      );
    }
  },
};

export default jwtToken;
