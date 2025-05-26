import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
// import { MidtransService } from '@ruraim/nestjs-midtrans';
import { SuccessResponseService } from 'src/helpers/success-response/success.service';
import { ErrorExecptionService } from 'src/helpers/error-execption/error.service';
import * as midtransClient from 'midtrans-client';
import { config } from 'src/config';

@Injectable()
export class PaymentService {
  private snap: midtransClient.Snap;
  constructor(
    // private readonly midtransService: MidtransService,
    private errorExecption: ErrorExecptionService,
  ) {
    this.snap = new midtransClient.Snap({
      isProduction: false, // Ganti ke true jika sudah live
      serverKey: config.midtransServerKey,
      clientKey: config.midtransClientKey,
    });
  }
  async createPayment(createPaymentDto: CreatePaymentDto) {
    try {
      const parameter = {
        transaction_details: {
          order_id: 'snmjsss-443333',
          gross_amount: 200000,
        },
        customer_details: {
          email: 'customer@gmail.com',
          first_name: 'John Doe',
          phone: '081234567890',
        },
        item_details: [
          {
            id: 'Item1',
            price: 100000,
            quantity: 1,
            name: 'Item 1',
          },
          {
            id: 'Item2',
            price: 50000,
            quantity: 2,
            name: 'Item 2',
          },
        ],
      };

      const transaction = await this.snap.createTransaction(parameter);
      return new SuccessResponseService({
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
