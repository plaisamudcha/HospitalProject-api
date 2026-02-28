import { SignUpDoctorDto, SignUpPatientDto } from '../types/authType';
import bcrypt from 'bcryptjs';
import prisma from '../config/prisma';
import { envConfig } from '../config/config';

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
};

export default authService;
