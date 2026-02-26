import z from 'zod';
import { validateHandler } from '../middlewares/validateHandler';

export const signUpSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .regex(
        /^[a-zA-Z0-9]{6,}$/,
        'Password must be at least 6 characters long and contain only letters and numbers',
      ),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
  });

export const signInSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const validateSignUp = validateHandler(signUpSchema);
export const validateSignIn = validateHandler(signInSchema);
