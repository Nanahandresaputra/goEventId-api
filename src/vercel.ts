import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'body-parser';

let appInstance: any;

const allowedOrigins = [
  'https://go-event-id-cms.vercel.app',
  'http://localhost:3000', // untuk dev lokal
];

export default async function handler(req: any, res: any) {
  const origin = req.headers.origin;
  const isAllowed = allowedOrigins.includes(origin);

  res.setHeader('Access-Control-Allow-Origin', isAllowed ? origin : 'null');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (!appInstance) {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('goEventId/api/v1');
    app.use(json({ limit: '5mb' }));

    app.enableCors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
    appInstance = app.getHttpAdapter().getInstance();
  }

  return appInstance(req, res);
}
