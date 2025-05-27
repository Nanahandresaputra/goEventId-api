import { Injectable } from '@nestjs/common';
import { CreatePemesananDto } from './dto/create-pemesanan.dto';
import { UtilsService } from 'src/helpers/utils/utils.service';
import { PrismaService } from 'src/db/prisma.service';
import { SuccessResponseService } from 'src/helpers/success-response/success.service';
import { ErrorExecptionService } from 'src/helpers/error-execption/error.service';
import * as midtransClient from 'midtrans-client';
import { config } from 'src/config';
import { UpdateStatusPemesananDto } from './dto/update-status-pemesanan.dto';

@Injectable()
export class PemesananService {
  private snap: midtransClient.Snap;

  constructor(
    private utils: UtilsService,
    private prisma: PrismaService,
    private errorExecption: ErrorExecptionService,
  ) {
    this.snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: config.midtransServerKey,
      clientKey: config.midtransClientKey,
    });
  }
  async create(
    userToken: { token: string },
    createPemesananDto: CreatePemesananDto,
  ) {
    try {
      const decodeToken = this.utils.decodeToken(userToken.token);
      const userId: number = decodeToken?.id;

      function generateOrderNumber() {
        const timestamp = new Date();
        const orderNumber =
          `${Math.random().toString(36).substring(6) + parseInt(`${timestamp.toISOString().slice(0, 10)}`.replace('-', '')) * timestamp.getTime()}`.toUpperCase();
        return orderNumber;
      }

      const createPemesanan = await this.prisma.pemesanan.create({
        data: {
          kode_pemesanan: `GE${`${generateOrderNumber()}`.substring(0, 14)}ID`,
          user_id: userId,
        },
      });

      const sendOrder = [...Array(createPemesananDto.ticketQty)].map(() => ({
        pemesanan_id: createPemesanan.id,
        tiket_acara_id: createPemesananDto.tiket_acara_id,
        kode_order: `ORD-${generateOrderNumber()}`.substring(0, 15),
      }));

      await this.prisma.order.createMany({ data: sendOrder });

      const findOnePemesanan = await this.prisma.pemesanan.findUnique({
        where: { id: createPemesanan.id },
        select: {
          id: true,
          kode_pemesanan: true,
          orders: {
            select: {
              id: true,
              pemesanan_id: true,
              tiket_acara: {
                select: {
                  id: true,
                  harga_tiket: true,
                  tiket_terjual: true,
                  acara: { select: { nama_acara: true } },
                },
              },
              kode_order: true,
              status: true,
              createdAt: true,
            },
          },
        },
      });

      const sendResp = {
        // ...findOnePemesanan,
        transaction_details: {
          order_id: `${findOnePemesanan?.kode_pemesanan}`, // diambil dari pemesanan id
          gross_amount: findOnePemesanan?.orders
            ?.map((data) => data.tiket_acara.harga_tiket)
            ?.reduce((acc, item) => acc + item, 0),
        },
        customer_details: {
          email: decodeToken?.email,
          first_name: decodeToken?.name,
        },
        item_details:
          findOnePemesanan?.orders?.map((data) => ({
            name: data.tiket_acara.acara.nama_acara,
            kode_order: data.kode_order,
            status: data.status,
            createdAt: data.createdAt,
            price: data.tiket_acara.harga_tiket,
            quantity: 1,
          })) ?? [],
        tiket_acara_id: findOnePemesanan?.orders?.map(
          (data) => data.pemesanan_id,
        )?.[0],
        tiket_acara_terjual:
          findOnePemesanan?.orders?.map(
            (data) => data.tiket_acara.tiket_terjual,
          )?.[0] ?? 0,
      };
      const transaction = await this.snap.createTransaction(sendResp);

      return new SuccessResponseService({
        data: {
          token: transaction.token,
          redirect_url: transaction.redirect_url,
        },
      });
    } catch (error) {
      return this.errorExecption.resp(error);
    }
  }

  async checkStatusPayment(updateStatusPemesananDto: UpdateStatusPemesananDto) {
    try {
      const getTotalOrders = await this.prisma.pemesanan.findFirst({
        where: { kode_pemesanan: updateStatusPemesananDto.kode_pemesanan },
        select: {
          orders: { select: { kode_order: true, tiket_acara_id: true } },
        },
      });

      const getTiketAcaraData = await this.prisma.tiket_Acara.findUnique({
        where: { id: getTotalOrders?.orders?.[0]?.tiket_acara_id },
      });

      const getMidtransStatusPayment = await fetch(
        `https://api.sandbox.midtrans.com/v2/${updateStatusPemesananDto.kode_pemesanan}/status`,
        {
          method: 'GET',
          headers: {
            Authorization: config.midtransAuthorization,
          },
        },
      )
        .then((res) => res.json())
        .then((res) => {
          return res;
        })
        .catch(() => {
          throw new Error();
        });

      const midtransResp = {
        status_code: getMidtransStatusPayment?.status_code,
        kode_pemesanan: getMidtransStatusPayment?.order_id,
        transaction_status: getMidtransStatusPayment?.transaction_status,
        gross_amount: getMidtransStatusPayment?.gross_amount,
      };
      if (getMidtransStatusPayment?.order_id) {
        if (
          ['settlement', 'success'].includes(midtransResp.transaction_status)
        ) {
          await this.prisma.pemesanan.updateMany({
            data: { status_pembayaran: 'berhasil' },
            where: { kode_pemesanan: midtransResp.kode_pemesanan },
          });

          await this.prisma.tiket_Acara.update({
            where: { id: getTiketAcaraData?.id },
            data: {
              tiket_terjual:
                (getTiketAcaraData?.tiket_terjual ?? 0) +
                (getTotalOrders?.orders?.length ?? 0),
            },
          });
        } else if (
          !['settlement', 'success'].includes(
            midtransResp.transaction_status,
          ) ||
          midtransResp.transaction_status !== 'pending'
        ) {
          await this.prisma.pemesanan.updateMany({
            data: { status_pembayaran: 'gagal' },
            where: { kode_pemesanan: midtransResp.kode_pemesanan },
          });
        }
      }

      return new SuccessResponseService();
    } catch (error) {
      return this.errorExecption.resp(error);
    }
  }
}
