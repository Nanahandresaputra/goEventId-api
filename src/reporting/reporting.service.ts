import { Injectable } from '@nestjs/common';
import { CreateReportingDto } from './dto/create-reporting.dto';
import { UpdateReportingDto } from './dto/update-reporting.dto';
// import { PrismaService } from 'src/db/prisma.service'; // local
import { PrismaService } from '../db/prisma.service'; // prod -> vercel
import { UtilsService } from 'src/helpers/utils/utils.service';
import { ErrorExecptionService } from 'src/helpers/error-execption/error.service';
import { SuccessResponseService } from 'src/helpers/success-response/success.service';
import moment from 'moment';
import 'moment/locale/id'; // without this line it didn't work
moment.locale('id');

@Injectable()
export class ReportingService {
  constructor(
    private prisma: PrismaService,
    private utils: UtilsService,
    private errorExecption: ErrorExecptionService,
  ) {}
  async findAll(token: string) {
    try {
      const decodeToken = this.utils.decodeToken(token);

      const listReportingAdmin = await this.prisma.acara.findMany({
        where: {
          status: 'publish',
          ...(decodeToken?.role === 'penyelenggara' && {
            user_id_penyelenggara: decodeToken?.id,
          }),
        },
        select: {
          id: true,
          nama_acara: true,
          waktu_acara: true,
          alamat: true,
          provinsi: { select: { nama: true } },
          kabupatenkota: { select: { nama: true } },
          status: true,
          user: { select: { nama: true, id: true } },
          tiket_acara: {
            select: {
              tipe_tiket: true,
              kuota: true,
              tiket_terjual: true,
              harga_tiket: true,
            },
          },
        },
      });

      const sendResp = listReportingAdmin.map((data) => ({
        id: data.id,
        nama_acara: data.nama_acara,
        status: data.status,
        waktu_acara: data.waktu_acara,
        totalTiketTerjual: data.tiket_acara.reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue.tiket_terjual,
          0,
        ),
        totalPenjualan: data.tiket_acara.reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue.tiket_terjual * currentValue.harga_tiket,
          0,
        ),
        details: {
          penyelenggara: data.user?.nama,
          penyelenggara_id: data.user?.id,
          waktu_acara: moment(data.waktu_acara).format('YYYY-MM-DD HH:mm:ss'),
          alamatLengkap: `${data.alamat}, ${data.kabupatenkota?.nama}, ${data.provinsi?.nama}`,
          tiket: data.tiket_acara.map((tiket) => ({
            ...tiket,
            pendapatan_tiket: tiket.harga_tiket * tiket.tiket_terjual,
          })),
        },
      }));

      return new SuccessResponseService({ data: sendResp });
    } catch (error) {
      return this.errorExecption.resp(error);
    }
  }
}
