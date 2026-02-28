import prisma from '../config/prisma';
import { UserPayload } from '../types/authType';

const userService = {
  findExistingUser: async (email: string) => {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    return existingUser;
  },
  getCurrentUser: async (user: UserPayload) => {
    if (user.role === 'DOCTOR') {
      return await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          doctor: true,
        },
        omit: {
          password: true,
        },
      });
    } else if (user.role === 'PATIENT') {
      return await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          patient: true,
        },
        omit: {
          password: true,
        },
      });
    }
  },
};

export default userService;
