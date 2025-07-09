import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProvinsiService } from './provinsi.service';
import { CreateProvinsiDto } from './dto/create-provinsi.dto';
import { UpdateProvinsiDto } from './dto/update-provinsi.dto';

@Controller('provinsi')
export class ProvinsiController {
  constructor(private readonly provinsiService: ProvinsiService) {}

  @Get()
  findAll() {
    return this.provinsiService.findAll();
  }
}
