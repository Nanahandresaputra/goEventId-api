import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { KabupatenkotaService } from './kabupatenkota.service';

@Controller('kabupatenkota')
export class KabupatenkotaController {
  constructor(private readonly kabupatenkotaService: KabupatenkotaService) {}

  @Get()
  findAll(@Headers() headers: { provinsi_id: number }) {
    return this.kabupatenkotaService.findAll(+headers.provinsi_id);
  }
}
