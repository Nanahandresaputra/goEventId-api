import { Injectable } from '@nestjs/common';
import { CreatePemesananDto } from './dto/create-pemesanan.dto';
import { UtilsService } from 'src/helpers/utils/utils.service';
import { PrismaService } from 'src/db/prisma.service';
import { SuccessResponseService } from 'src/helpers/success-response/success.service';
import { ErrorExecptionService } from 'src/helpers/error-execption/error.service';

@Injectable()
export class PemesananService {
  constructor(
    private utils: UtilsService,
    private prisma: PrismaService,
    private errorExecption: ErrorExecptionService,
  ) {}
  async create(
    userToken: { token: string },
    createPemesananDto: CreatePemesananDto,
  ) {
    try {
      const decodeToken = this.utils.decodeToken(userToken.token);
      const userId: number = decodeToken?.id;

      function generateOrderNumber(): string {
        const timestamp = Date.now();
        const orderNumber = `${timestamp}`;
        return orderNumber;
      }

      const createPemesanan = await this.prisma.pemesanan.create({
        data: { kode_pemesanan: generateOrderNumber(), user_id: userId },
      });

      const sendOrder = [...Array(createPemesananDto.ticketQty)].map(() => ({
        pemesanan_id: createPemesanan.id,
        tiket_acara_id: createPemesananDto.tiket_acara_id,
        kode_order: `ORD-${generateOrderNumber()}`,
      }));

      await this.prisma.order.createMany({ data: sendOrder });

      return new SuccessResponseService();
    } catch (error) {
      return this.errorExecption.resp(error);
    }
  }
}
