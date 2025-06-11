import { Module } from '@nestjs/common';
import { PenyelenggaraService } from './penyelenggara.service';
import { PenyelenggaraController } from './penyelenggara.controller';

@Module({
  controllers: [PenyelenggaraController],
  providers: [PenyelenggaraService],
})
export class PenyelenggaraModule {}
