import { Injectable } from '@nestjs/common';
import { CreateKategoriDto } from './dto/create-kategori.dto';
import { UpdateKategoriDto } from './dto/update-kategori.dto';
import { PrismaService } from 'src/db/prisma.service';
import { UtilsService } from 'src/helpers/utils/utils.service';
import { ErrorExecptionService } from 'src/helpers/error-execption/error.service';
import { SuccessResponseService } from 'src/helpers/success-response/success.service';

@Injectable()
export class KategoriService {
  constructor(
    private prisma: PrismaService,
    // private utils: UtilsService,
    private errorExecption: ErrorExecptionService,
  ) {}
  async create(createKategoriDto: CreateKategoriDto) {
    try {
      await this.prisma.kategori.create({ data: { ...createKategoriDto } });

      return new SuccessResponseService();
    } catch (error) {
      this.errorExecption.resp(error);
    }
  }

  async findAll() {
    try {
      const categories = await this.prisma.kategori.findMany();

      return new SuccessResponseService({ data: categories });
    } catch (error) {
      return this.errorExecption.resp(error);
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} kategori`;
  // }

  async update(id: number, updateKategoriDto: UpdateKategoriDto) {
    try {
      await this.prisma.kategori.update({
        data: { ...updateKategoriDto },
        where: { id },
      });

      return new SuccessResponseService();
    } catch (error) {
      return this.errorExecption.resp(error);
    }
  }

  // remove(id: number) {
  //   return `This action removes a #${id} kategori`;
  // }
}
