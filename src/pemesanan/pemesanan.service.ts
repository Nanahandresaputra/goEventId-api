import { Injectable } from '@nestjs/common';
import { CreatePemesananDto } from './dto/create-pemesanan.dto';
import { UpdatePemesananDto } from './dto/update-pemesanan.dto';

@Injectable()
export class PemesananService {
  create(createPemesananDto: CreatePemesananDto) {
    return 'This action adds a new pemesanan';
  }

  findAll() {
    return `This action returns all pemesanan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pemesanan`;
  }

  update(id: number, updatePemesananDto: UpdatePemesananDto) {
    return `This action updates a #${id} pemesanan`;
  }

  remove(id: number) {
    return `This action removes a #${id} pemesanan`;
  }
}
