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
import { TiketAcaraService } from './tiket_acara.service';
import { CreateTiketAcaraDto } from './dto/create-tiket_acara.dto';
import { UpdateTiketAcaraDto } from './dto/update-tiket_acara.dto';

@Controller('tiket-acara')
export class TiketAcaraController {
  constructor(private readonly tiketAcaraService: TiketAcaraService) {}

  @Post()
  create(@Body() createTiketAcaraDto: CreateTiketAcaraDto) {
    return this.tiketAcaraService.create(createTiketAcaraDto);
  }

  @Get()
  findAll(@Headers() headers: { acara_id: number }) {
    return this.tiketAcaraService.findAll(+headers.acara_id);
  }

  @Patch()
  update(
    @Headers() headers: { id: number },
    @Body() updateTiketAcaraDto: UpdateTiketAcaraDto,
  ) {
    return this.tiketAcaraService.update(+headers.id, updateTiketAcaraDto);
  }

  @Delete()
  remove(@Headers() headers: { id: number }) {
    return this.tiketAcaraService.remove(+headers.id);
  }
}
