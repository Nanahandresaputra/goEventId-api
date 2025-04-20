import * as dotenv from 'dotenv';
dotenv.config({ path: process.cwd() + `/.env.${process.env.NODE_ENV}` });

export const config = {
  secretKey: process.env.SECRET_KEY,
};
