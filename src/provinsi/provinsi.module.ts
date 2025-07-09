import { Module } from '@nestjs/common';
import { ProvinsiService } from './provinsi.service';
import { ProvinsiController } from './provinsi.controller';

@Module({
  controllers: [ProvinsiController],
  providers: [ProvinsiService],
})
export class ProvinsiModule {}
