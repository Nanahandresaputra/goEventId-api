import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'body-parser';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import bodyParser = require('body-parser');
import * as moment from 'moment';

async function bootstrap() {
  try {
    require('moment/locale/id');
    moment.locale('id');
    console.log('Moment locale set to:', moment.locale());
  } catch (e) {
    console.error('Gagal load moment locale:', e);
  }

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('goEventId/api/v1');
  app.use(json({ limit: '5mb' }));
  // const uploadDir = join(process.cwd(), 'uploads');
  // if (!existsSync(uploadDir)) {
  //   mkdirSync(uploadDir);
  // }
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // transformOptions: {
      //   enableImplicitConversion: true, // <- This line here
      // },
    }),
  );
  // app.use(bodyParser.urlencoded({ extended: true }));
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
