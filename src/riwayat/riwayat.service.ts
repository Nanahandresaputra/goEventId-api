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
      const listRiwayat = await this.prisma.order.findMany({
        where: {
          pemesanan: { user_id: decodeToken.id, status_pembayaran: 'berhasil' },
        },
        select: {
          pemesanan: true,
          kode_order: true,
          status: true,
          tiket_acara: {
            select: {
              tipe_tiket: true,
              acara: {
                select: {
                  nama_acara: true,
                  banner_img: true,
                  alamat: true,
                  provinsi: { select: { nama: true } },
                  kabupatenkota: { select: { nama: true } },
                  waktu_acara: true,
                },
              },
            },
          },
        },
      });

      function formatString(inputString: string) {
        // Replace underscores with spaces
        let result = inputString.replace(/_/g, ' ');

        // Capitalize the first letter of each word
        result = result
          .split(' ')
          .map((word) => {
            if (word.length === 0) {
              return '';
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
          })
          .join(' ');

        return result;
      }

      const sendResp = listRiwayat.map((data) => ({
        id: data.pemesanan.id,
        acara: data.tiket_acara.acara.nama_acara,
        kode_order: formatString(data.kode_order),
        kode_pemesanan: data.pemesanan.kode_pemesanan,
        status_order: data.status,
        status_pembayaran: data.pemesanan.status_pembayaran,
        tipe_tiket: data.tiket_acara.tipe_tiket,
        waktu_acara: data.tiket_acara.acara.waktu_acara,
        createdat: data.pemesanan.createdat,
        tempat_acara: `${data.tiket_acara.acara.alamat}, ${data.tiket_acara.acara.kabupatenkota?.nama}, ${data.tiket_acara.acara.provinsi?.nama}`,
        banner_img: data.tiket_acara.acara.banner_img,
      }));

      // const listRiwayat = await this.prisma.pemesanan.findMany({
      //   where: { users: { id: decodeToken.id }, status_pembayaran: 'berhasil' },
      // });

      return new SuccessResponseService({
        data: sendResp,
      });
    } catch (error) {
      return this.errorExecption.resp(error);
    }
  }
}
