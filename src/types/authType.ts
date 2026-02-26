import z from 'zod';
import {
  signInSchema,
  signUpDoctorSchema,
  signUpPatientSchema,
} from '../validators/authValidator';

export type UserPayload = {
  id: number;
  email: string;
};

export type SignUpDoctorDto = z.infer<typeof signUpDoctorSchema>;
export type SignUpPatientDto = z.infer<typeof signUpPatientSchema>;
export type SignInDto = z.infer<typeof signInSchema>;
