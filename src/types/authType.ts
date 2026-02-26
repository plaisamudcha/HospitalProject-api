import z from 'zod';
import { signInSchema, signUpSchema } from '../validators/authValidator';

export type UserPayload = {
  id: number;
  email: string;
};

export type SignUpDto = z.infer<typeof signUpSchema>;
export type SignInDto = z.infer<typeof signInSchema>;
