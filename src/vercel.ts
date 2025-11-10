import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'body-parser';

let appInstance: any;

export default async function handler(req: any, res: any) {
  if (!appInstance) {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('goEventId/api/v1');
    app.use(json({ limit: '5mb' }));
    // app.enableCors();
    app.enableCors({
      origin: ['https://go-event-id-cms.vercel.app'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
      credentials: true,
    });
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
    appInstance = app.getHttpAdapter().getInstance();
  }

  return appInstance(req, res);
}
