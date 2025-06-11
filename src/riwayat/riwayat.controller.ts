import { Controller, Get, Headers } from '@nestjs/common';
import { RiwayatService } from './riwayat.service';

@Controller('riwayat')
export class RiwayatController {
  constructor(private readonly riwayatService: RiwayatService) {}

  @Get()
  findAll(@Headers() headers: { token: string }) {
    return this.riwayatService.findAll(headers.token);
  }
}
