import prisma from '../config/prisma';

const userService = {
  findExistingUser: async (email: string) => {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    return existingUser;
  },
};

export default userService;
