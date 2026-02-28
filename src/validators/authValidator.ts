import z from 'zod';
import { validateHandler } from '../middlewares/validateHandler';
import { DoctorType, Gender } from '@prisma/client';

export const signUpDoctorSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.email('Invalid email address'),
    password: z
      .string()
      .regex(
        /^[a-zA-Z0-9]{6,}$/,
        'Password must be at least 6 characters long and contain only letters and numbers',
      ),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
    specialization: z.nativeEnum(DoctorType, {
      message: 'Invalid specialization',
    }),
    profileImage: z.url('Invalid URL for profile image').optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
  });

export const signUpPatientSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.email('Invalid email address'),
    password: z
      .string()
      .regex(
        /^[a-zA-Z0-9]{6,}$/,
        'Password must be at least 6 characters long and contain only letters and numbers',
      ),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
    dob: z.coerce.date().refine((date) => date <= new Date(), {
      message: 'Date of birth cannot be in the future',
    }),
    gender: z.nativeEnum(Gender, {
      message: 'Invalid gender',
    }),
    phone: z
      .string()
      .regex(
        /^(08|09)\d{8}$/,
        'Phone number must be 10 digits and start with 08 or 09',
      ),
    profileImage: z.url('Invalid URL for profile image').optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
  });

export const singUpAdminScheme = z
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
    profileImage: z.url('Invalid URL for profile image').optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
  });

export const signInSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string(),
});

export const forgotPasswordSchema = z.object({
  email: z.email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .regex(
      /^[a-zA-Z0-9]{6,}$/,
      'Password must be at least 6 characters long and contain only letters and numbers',
    ),
});

export const validateSignUpDoctor = validateHandler(signUpDoctorSchema);
export const validateSignUpPatient = validateHandler(signUpPatientSchema);
export const validateSignUpAdmin = validateHandler(singUpAdminScheme);
export const validateSignIn = validateHandler(signInSchema);
export const validateForgotPassword = validateHandler(forgotPasswordSchema);
export const validateResetPassword = validateHandler(resetPasswordSchema);
