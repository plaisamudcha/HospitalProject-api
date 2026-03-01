/* eslint-disable @typescript-eslint/no-explicit-any */
import { envConfig } from '../config/config';
import prisma from '../config/prisma';
import { QuerySearch } from '../types/apiType';

type FilterMore = {
  specialization?: string;
  userId?: number;
};

const doctorService = {
  list: async ({
    filter,
    search,
    startDate,
    endDate,
    page = envConfig.DEFAULT_PAGE_NUMBER,
    pageSize = envConfig.DEFAULT_PAGE_SIZE,
    sorting = 'createdAt',
    desc = true,
  }: QuerySearch<FilterMore>) => {
    const where: any = {};

    // apply filter fields (e.g., specialization)
    if (filter) {
      if (filter.specialization) where.specialization = filter.specialization;
      if (filter.userId) where.userId = filter.userId;
    }

    // apply date range on related user.createdAt (if provided)
    const userWhere: any = {};
    if (startDate || endDate) {
      userWhere.createdAt = {};
      if (startDate) userWhere.createdAt.gte = new Date(startDate);
      if (endDate) userWhere.createdAt.lte = new Date(endDate);
    }

    // apply search on user's name or email
    const searchWhere = search
      ? {
          OR: [
            { user: { firstName: { contains: search, mode: 'insensitive' } } },
            { user: { lastName: { contains: search, mode: 'insensitive' } } },
            { user: { email: { contains: search, mode: 'insensitive' } } },
          ],
        }
      : {};

    // combine where clauses
    const combinedWhere = {
      ...where,
      AND: [
        searchWhere,
        Object.keys(userWhere).length ? { user: userWhere } : {},
      ].filter(Boolean),
    };

    // determine orderBy
    let orderBy: any = {};
    const direction = desc ? 'desc' : 'asc';
    if (sorting === 'createdAt') orderBy = { user: { createdAt: direction } };
    else orderBy[sorting] = direction;

    const total = await prisma.doctor.count({ where: combinedWhere });

    const datas = await prisma.doctor.findMany({
      where: combinedWhere,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            isActive: true,
            profileImage: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPages = Math.ceil(total / pageSize) || 1;

    return {
      datas,
      total,
      totalPages,
      page,
      pageSize,
    };
  },
};

export default doctorService;
