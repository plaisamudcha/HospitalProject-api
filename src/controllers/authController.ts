/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Request, Response } from 'express';
import { ApiResponse, HttpStatusCode } from '../types/apiType';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDoctorDto,
  SignUpPatientDto,
  UserPayload,
} from '../types/authType';
import authService from '../services/authService';
import { HttpError } from '../utils/httpError';
import jwtToken from '../utils/jwtToken';
import { envConfig } from '../config/config';
import userService from '../services/userService';
import sendResetPasswordEmail from '../utils/resetPassword';

const authController = {
  signUpPatient: async (
    req: Request<{}, ApiResponse, SignUpPatientDto>,
    res: Response<ApiResponse>,
  ): Promise<void> => {
    await authService.signUpPatient(req.body);

    res.status(HttpStatusCode.CREATED).json({
      success: true,
      message: 'Patient registered successfully',
    });
  },
  signUpDoctor: async (
    req: Request<{}, ApiResponse, SignUpDoctorDto>,
    res: Response<ApiResponse>,
  ): Promise<void> => {
    await authService.signUpDoctor(req.body);

    res.status(HttpStatusCode.CREATED).json({
      success: true,
      message: 'Doctor registered successfully',
    });
  },
  signIn: async (
    req: Request<{}, ApiResponse<any>, SignInDto>,
    res: Response<ApiResponse<any>>,
  ): Promise<void> => {
    const { email, password } = req.body;

    const user = await authService.signInUser({ email, password });

    if (!user) {
      throw new HttpError(
        'Invalid email or password',
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    const payload: UserPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwtToken.generateToken(payload);
    const refreshToken = jwtToken.generateRefreshToken(payload);

    await authService.createRefreshToken(user.id, refreshToken);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: envConfig.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: envConfig.JWT_REFRESH_EXPIRES * 1000, // Set cookie expiration time
    });
    const { password: hashedPassword, ...userWithoutPassword } = user;

    res.status(HttpStatusCode.OK).json({
      success: true,
      message: 'User signed in successfully',
      data: {
        user: userWithoutPassword,
        accessToken,
      },
    });
  },
  refreshToken: async (
    req: Request,
    res: Response<ApiResponse<any>>,
  ): Promise<void> => {
    const token = (req.cookies && (req.cookies as any).refreshToken) as
      | string
      | undefined;

    if (!token) {
      throw new HttpError(
        'Invalid or expired refresh token',
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    // verify JWT signature first (will throw if invalid)
    try {
      jwtToken.verifyRefreshToken(token);
    } catch (err) {
      // token invalid -> remove from store and cookie
      await authService.revokeRefreshToken(token);
      res.clearCookie('refreshToken');
      throw new HttpError(
        'Invalid or expired refresh token',
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    const refreshTokenRecord = await authService.findRefreshToken(token);

    if (!refreshTokenRecord) {
      res.clearCookie('refreshToken');
      throw new HttpError(
        'Invalid or expired refresh token',
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    if (refreshTokenRecord.expiresAt < new Date()) {
      await authService.revokeRefreshToken(token);
      res.clearCookie('refreshToken');
      throw new HttpError(
        'Invalid or expired refresh token',
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    const payload: UserPayload = {
      id: refreshTokenRecord.user.id,
      email: refreshTokenRecord.user.email,
      role: refreshTokenRecord.user.role,
    };

    const newRefreshToken = jwtToken.generateRefreshToken(payload);
    const newAccessToken = jwtToken.generateToken(payload);

    await authService.updateRefreshToken(token, newRefreshToken);
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: envConfig.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: envConfig.JWT_REFRESH_EXPIRES * 1000, // Set cookie expiration time
    });
    res.status(HttpStatusCode.OK).json({
      success: true,
      message: 'Refresh token updated successfully',
      data: {
        accessToken: newAccessToken,
      },
    });
  },
  forgotPassword: async (
    req: Request<{}, ApiResponse, ForgotPasswordDto>,
    res: Response<ApiResponse>,
  ): Promise<void> => {
    const { email } = req.body;

    const user = await userService.findExistingUser(email);

    if (user) {
      const payload: UserPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };
      const resetToken = jwtToken.generateResetPasswordToken(payload);
      try {
        await sendResetPasswordEmail(email, resetToken);
      } catch (err) {
        throw new HttpError(
          err instanceof Error ? err.message : 'Failed to send reset email',
          HttpStatusCode.INTERNAL_SERVER_ERROR,
        );
      }
    }

    res.status(HttpStatusCode.OK).json({
      success: true,
      message: 'Reset email has been sent',
    });
  },
  resetPassword: async (
    req: Request<{ token: string }, ApiResponse, ResetPasswordDto>,
    res: Response<ApiResponse>,
  ): Promise<void> => {
    const { token } = req.params;
    const { password } = req.body;

    const payload = jwtToken.verifyResetPasswordToken(token);
    const user = await userService.findExistingUser(payload.email);

    if (!user) {
      throw new HttpError(
        'Invalid reset token or user not found',
        HttpStatusCode.BAD_REQUEST,
      );
    }

    await authService.resetPassword(user.id, password);
    res.status(HttpStatusCode.OK).json({
      success: true,
      message: 'Password reset successfully',
    });
  },
  getCurrentUser: async (
    req: Request,
    res: Response<ApiResponse<any>>,
  ): Promise<void> => {
    const user: UserPayload = (req as any).user;

    const userData = await userService.getCurrentUser(user);

    if (!userData) {
      throw new HttpError('User not found', HttpStatusCode.NOT_FOUND);
    }

    res.status(HttpStatusCode.OK).json({
      success: true,
      message: 'Current user retrieved successfully',
      data: userData,
    });
  },
};

export default authController;
