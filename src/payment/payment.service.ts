import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
// import { MidtransService } from '@ruraim/nestjs-midtrans';
import { SuccessResponseService } from 'src/helpers/success-response/success.service';
import { ErrorExecptionService } from 'src/helpers/error-execption/error.service';
import * as midtransClient from 'midtrans-client';
import { config } from 'src/config';
import { PrismaService } from 'src/db/prisma.service';
import { UtilsService } from 'src/helpers/utils/utils.service';

@Injectable()
export class PaymentService {
  private snap: midtransClient.Snap;
  constructor(
    // private readonly midtransService: MidtransService,
    private prisma: PrismaService,
    private utils: UtilsService,

    private errorExecption: ErrorExecptionService,
  ) {
    this.snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: config.midtransServerKey,
      clientKey: config.midtransClientKey,
    });
  }
  async createPayment(
    createPaymentDto: CreatePaymentDto,
    headers: { token: string },
  ) {
    try {
      const findOnePemesanan = await this.prisma.pemesanan.findUnique({
        where: { id: createPaymentDto.pemesanan_id },
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

      const userData = this.utils.decodeToken(headers.token);

      const sendResp = {
        // ...findOnePemesanan,
        transaction_details: {
          order_id: `${findOnePemesanan?.kode_pemesanan}`, // diambil dari pemesanan id
          gross_amount: findOnePemesanan?.orders
            ?.map((data) => data.tiket_acara.harga_tiket)
            ?.reduce((acc, item) => acc + item, 0),
        },
        customer_details: {
          email: userData?.email,
          first_name: userData?.name,
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

      // await this.prisma.tiket_Acara.update({
      //   where: { id: sendResp.tiket_acara_id },
      //   data: {
      //     // ...createPaymentDto,
      //     tiket_terjual:
      //       sendResp.tiket_acara_terjual + sendResp.item_details?.length,
      //   },
      // });

      const transaction = await this.snap.createTransaction(sendResp);

      return new SuccessResponseService({
        // data: {
        //   ...sendResp,
        // },
        data: {
          token: transaction.token,
          redirect_url: transaction.redirect_url,
        },
      });

      // const result = await this.midtransService.charge({
      //   payment_type: 'bank_transfer',
      // transaction_details: {
      //   order_id: 'snmjsss-77744',
      //   gross_amount: 200000,
      // },
      // customer_details: {
      //   email: 'customer@gmail.com',
      //   first_name: 'John Doe',
      //   phone: '081234567890',
      // },
      // item_details: [
      //   {
      //     id: 'Item1',
      //     price: 100000,
      //     quantity: 1,
      //     name: 'Item 1',
      //   },
      //   {
      //     id: 'Item2',
      //     price: 50000,
      //     quantity: 2,
      //     name: 'Item 2',
      //   },
      // ],
      //   bank_transfer: {
      //     bank: 'bni',
      //   },
      // });

      // console.log({ result });
      // console.log(result.va_numbers[0].bank);
      // console.log(result.va_numbers[0].va_number);
      // return new SuccessResponseService({ data: result });
    } catch (error) {
      return this.errorExecption.resp(error);
    }
  }
}
