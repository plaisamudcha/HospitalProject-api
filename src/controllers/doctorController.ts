/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import {
  HttpStatusCode,
  PaginationResponse,
  QuerySearch,
} from '../types/apiType';
import doctorService from '../services/doctorService';
import { envConfig } from '../config/config';

const doctorController = {
  listDoctors: async (
    req: Request<{}, any, any, Partial<QuerySearch<any>>>,
    res: Response<PaginationResponse<any>>,
  ): Promise<void> => {
    const rawQuery = req.query || {};

    const query: QuerySearch<any> = {
      filter: (rawQuery.filter as any) || undefined,
      search: (rawQuery.search as any) || undefined,
      startDate: (rawQuery.startDate as any) || undefined,
      endDate: (rawQuery.endDate as any) || undefined,
      sorting: (rawQuery.sorting as any) || 'createdAt',
      desc: (() => {
        const d = rawQuery.desc as any;
        if (d === undefined) return true;
        if (typeof d === 'boolean') return d;
        if (typeof d === 'string') {
          const lowered = d.toLowerCase();
          return lowered !== 'false' && lowered !== '0';
        }
        return true;
      })(),
      page: rawQuery.page
        ? Number(rawQuery.page)
        : envConfig.DEFAULT_PAGE_NUMBER,
      pageSize: rawQuery.pageSize
        ? Number(rawQuery.pageSize)
        : envConfig.DEFAULT_PAGE_SIZE,
    };

    const data = await doctorService.list(query);

    res.status(HttpStatusCode.OK).json({
      success: true,
      message: 'Doctors retrieved successfully',
      data,
    });
  },
};

export default doctorController;
