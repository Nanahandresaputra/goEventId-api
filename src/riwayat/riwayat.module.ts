import { Module } from '@nestjs/common';
import { RiwayatService } from './riwayat.service';
import { RiwayatController } from './riwayat.controller';

@Module({
  controllers: [RiwayatController],
  providers: [RiwayatService],
})
export class RiwayatModule {}
