import z from 'zod';
import {
  forgotPasswordSchema,
  signInSchema,
  signUpDoctorSchema,
  signUpPatientSchema,
} from '../validators/authValidator';
import { RoleType } from '@prisma/client';

export type UserPayload = {
  id: string;
  email: string;
  role: RoleType;
};

export type SignUpDoctorDto = z.infer<typeof signUpDoctorSchema>;
export type SignUpPatientDto = z.infer<typeof signUpPatientSchema>;
export type SignInDto = z.infer<typeof signInSchema>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
