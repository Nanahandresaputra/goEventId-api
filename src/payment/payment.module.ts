import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Module } from '@nestjs/common';
import { MidtransModule } from '@ruraim/nestjs-midtrans';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from '../config/index';

// console.log('config ----------->', config);

@Module({
  // imports: [
  //   MidtransModule.registerAsync({
  //     useFactory: () => ({
  //       clientKey: config.midtransClientKey,
  //       serverKey: config.midtransServerKey,
  //       merchantId: config.midtransMerchantId,
  //       sandbox: true,
  //     }),
  //     // using ConfigService from @nestjs/config to get .env value
  //     inject: [ConfigService],
  //     imports: [ConfigModule],
  //     isGlobal: true, // default: false, register module globally
  //   }),
  // ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
