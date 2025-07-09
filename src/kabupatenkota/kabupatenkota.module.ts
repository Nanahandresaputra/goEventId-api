import { Module } from '@nestjs/common';
import { KabupatenkotaService } from './kabupatenkota.service';
import { KabupatenkotaController } from './kabupatenkota.controller';

@Module({
  controllers: [KabupatenkotaController],
  providers: [KabupatenkotaService],
})
export class KabupatenkotaModule {}
