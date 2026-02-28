import z from 'zod';
import {
  signInSchema,
  signUpDoctorSchema,
  signUpPatientSchema,
} from '../validators/authValidator';
import { RoleType } from '@prisma/client';

export type UserPayload = {
  id: number;
  email: string;
  role: RoleType;
};

export type SignUpDoctorDto = z.infer<typeof signUpDoctorSchema>;
export type SignUpPatientDto = z.infer<typeof signUpPatientSchema>;
export type SignInDto = z.infer<typeof signInSchema>;
