import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { ErrorExecptionService } from 'src/helpers/error-execption/error.service';
import { SuccessResponseService } from 'src/helpers/success-response/success.service';
import { UtilsService } from 'src/helpers/utils/utils.service';

@Injectable()
export class RiwayatService {
  constructor(
    private prisma: PrismaService,
    private utils: UtilsService,
    private errorExecption: ErrorExecptionService,
  ) {}
  async findAll(token: string) {
    try {
      const decodeToken = this.utils.decodeToken(token);
      const listRiwayat = await this.prisma.pemesanan.findMany({
        where: { users: { id: decodeToken.id }, status_pembayaran: 'berhasil' },
      });

      return new SuccessResponseService({
        data: listRiwayat,
      });
    } catch (error) {
      return this.errorExecption.resp(error);
    }
  }
}
