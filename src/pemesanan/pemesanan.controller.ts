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
import { PemesananService } from './pemesanan.service';
import { CreatePemesananDto } from './dto/create-pemesanan.dto';
import { UpdateStatusPemesananDto } from './dto/update-status-pemesanan.dto';

@Controller('pemesanan')
export class PemesananController {
  constructor(private readonly pemesananService: PemesananService) {}

  @Post()
  create(
    @Headers() headers: { token: string },

    @Body() createPemesananDto: CreatePemesananDto,
  ) {
    return this.pemesananService.create(headers, createPemesananDto);
  }
  @Post('update-status')
  checkStatusPayment(
    @Body() updateStatusPemesananDto: UpdateStatusPemesananDto,
  ) {
    return this.pemesananService.checkStatusPayment(updateStatusPemesananDto);
  }
}
