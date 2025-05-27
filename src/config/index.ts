import * as dotenv from 'dotenv';
dotenv.config({ path: process.cwd() + `/.env.${process.env.NODE_ENV}` });

export const config = {
  secretKey: process.env.SECRET_KEY as string,
  midtransClientKey: process.env.MIDTRANS_CLIENT_KEY as string,
  midtransMerchantId: process.env.MIDTRANS_MERCHANT_ID as string,
  midtransServerKey: process.env.MIDTRANS_SERVER_KEY as string,
  midtransAuthorization: process.env.MIDTRANS_AUTHORIZATION as string,
};
