import { Module } from '@nestjs/common';
import { TiketAcaraService } from './tiket_acara.service';
import { TiketAcaraController } from './tiket_acara.controller';

@Module({
  controllers: [TiketAcaraController],
  providers: [TiketAcaraService],
})
export class TiketAcaraModule {}
