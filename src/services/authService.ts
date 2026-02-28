import {
  SignInDto,
  SignUpDoctorDto,
  SignUpPatientDto,
} from '../types/authType';
import bcrypt from 'bcryptjs';
import prisma from '../config/prisma';
import { envConfig } from '../config/config';
import userService from './userService';

const authService = {
  signUpPatient: async (data: SignUpPatientDto) => {
    const hashedPassword = await bcrypt.hash(
      data.password,
      envConfig.BCRYPT_SALT_ROUNDS,
    );

    await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        patient: {
          create: {
            dob: data.dob,
            gender: data.gender,
            phone: data.phone,
          },
        },
      },
    });
  },
  signUpDoctor: async (data: SignUpDoctorDto) => {
    const hashedPassword = await bcrypt.hash(
      data.password,
      envConfig.BCRYPT_SALT_ROUNDS,
    );

    await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        doctor: {
          create: {
            specialization: data.specialization,
          },
        },
      },
    });
  },
  signInUser: async (data: SignInDto) => {
    const user = await userService.findExistingUser(data.email);

    if (!user) return null;
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    return isPasswordValid ? user : null;
  },
  createRefreshToken: async (userId: number, refreshToken: string) => {
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt: new Date(Date.now() + envConfig.JWT_REFRESH_EXPIRES * 1000), // Set expiration time
      },
    });
  },
};

export default authService;
