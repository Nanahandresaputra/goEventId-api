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
import { PenyelenggaraService } from './penyelenggara.service';
import { CreatePenyelenggaraDto } from './dto/create-penyelenggara.dto';
import { UpdatePenyelenggaraDto } from './dto/update-penyelenggara.dto';

@Controller('penyelenggara')
export class PenyelenggaraController {
  constructor(private readonly penyelenggaraService: PenyelenggaraService) {}

  @Post()
  create(@Body() createPenyelenggaraDto: CreatePenyelenggaraDto) {
    return this.penyelenggaraService.create(createPenyelenggaraDto);
  }

  @Get()
  findAll() {
    return this.penyelenggaraService.findAll();
  }

  @Patch()
  update(
    @Headers() headers: { id: number },
    @Body() updatePenyelenggaraDto: UpdatePenyelenggaraDto,
  ) {
    return this.penyelenggaraService.update(
      +headers.id,
      updatePenyelenggaraDto,
    );
  }
}
