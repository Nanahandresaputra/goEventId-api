import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'body-parser';

let appInstance: any;

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (!appInstance) {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('goEventId/api/v1');
    app.use(json({ limit: '5mb' }));
    app.enableCors();

    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
    appInstance = app.getHttpAdapter().getInstance();
  }

  return appInstance(req, res);
}
