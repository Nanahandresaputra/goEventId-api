import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/db/prisma.service';
import { ErrorExecptionService } from 'src/helpers/error-execption/error.service';
import { SuccessResponseService } from 'src/helpers/success-response/success.service';

@Injectable()
export class KabupatenkotaService {
  constructor(
    private prisma: PrismaService,
    private errorExecption: ErrorExecptionService,
  ) {}
  async findAll(provinsi_id: number) {
    try {
      const kabupatenkota = await this.prisma
        .$queryRaw`SELECT DISTINCT k.id, k.nama 
      FROM kabupatenkota AS k 
      JOIN provinsi AS p 
      ON SUBSTRING(k.id::text, 1, 2) = ${provinsi_id}::text 
      GROUP BY k.id, k.nama`;

      return new SuccessResponseService({ data: kabupatenkota });
    } catch (error) {
      return this.errorExecption.resp(error);
    }
  }
}
