import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PemesananService } from './pemesanan.service';
import { CreatePemesananDto } from './dto/create-pemesanan.dto';
import { UpdatePemesananDto } from './dto/update-pemesanan.dto';

@Controller('pemesanan')
export class PemesananController {
  constructor(private readonly pemesananService: PemesananService) {}

  @Post()
  create(@Body() createPemesananDto: CreatePemesananDto) {
    return this.pemesananService.create(createPemesananDto);
  }

  @Get()
  findAll() {
    return this.pemesananService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pemesananService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePemesananDto: UpdatePemesananDto) {
    return this.pemesananService.update(+id, updatePemesananDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pemesananService.remove(+id);
  }
}
