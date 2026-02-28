/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Request, Response } from 'express';
import { ApiResponse, HttpStatusCode } from '../types/apiType';
import {
  SignInDto,
  SignUpDoctorDto,
  SignUpPatientDto,
  UserPayload,
} from '../types/authType';
import authService from '../services/authService';
import { HttpError } from '../utils/httpError';
import jwtToken from '../utils/jwtToken';
import { envConfig } from '../config/config';

const authController = {
  signUpPatient: async (
    req: Request<{}, ApiResponse, SignUpPatientDto>,
    res: Response<ApiResponse>,
  ): Promise<void> => {
    await authService.signUpPatient(req.body);

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
    });
  },
  signUpDoctor: async (
    req: Request<{}, ApiResponse, SignUpDoctorDto>,
    res: Response<ApiResponse>,
  ): Promise<void> => {
    await authService.signUpDoctor(req.body);

    res.status(201).json({
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

    res.status(200).json({
      success: true,
      message: 'User signed in successfully',
      data: {
        user: userWithoutPassword,
        accessToken,
      },
    });
  },
};

export default authController;
