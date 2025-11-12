// api/index.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'body-parser';

let appInstance: any;

const allowedOrigins = [
  'https://go-event-id-cms.vercel.app',
  'http://localhost:3000',
];

export default async function handler(req: any, res: any) {
  const origin = req.headers.origin;
  const isAllowed = allowedOrigins.includes(origin);

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', isAllowed ? origin : '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.status(204).end();
    return;
  }

  if (!appInstance) {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('goEventId/api/v1');
    app.use(json({ limit: '5mb' }));

    app.enableCors({
      origin: allowedOrigins,
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    });

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();
    appInstance = app.getHttpAdapter().getInstance();
  }

  // --- Tambahkan header CORS juga untuk setiap respons utama (XHR) ---
  res.setHeader('Access-Control-Allow-Origin', isAllowed ? origin : '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  return appInstance(req, res);
}
