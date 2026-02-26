/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Request, Response } from 'express';
import { ApiResponse } from '../types/apiType';
import { SignUpPatientDto } from '../types/authType';
import authService from '../services/authService';

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
};

export default authController;
