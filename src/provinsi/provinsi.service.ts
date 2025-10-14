import { Injectable } from '@nestjs/common';
import { CreateProvinsiDto } from './dto/create-provinsi.dto';
import { UpdateProvinsiDto } from './dto/update-provinsi.dto';
// import { PrismaService } from 'src/db/prisma.service'; // local
import { PrismaService } from '../db/prisma.service'; // prod -> vercel
import { UtilsService } from 'src/helpers/utils/utils.service';
import { ErrorExecptionService } from 'src/helpers/error-execption/error.service';
import { SuccessResponseService } from 'src/helpers/success-response/success.service';

@Injectable()
export class ProvinsiService {
  constructor(
    private prisma: PrismaService,
    private utils: UtilsService,
    private errorExecption: ErrorExecptionService,
  ) {}

  async findAll() {
    try {
      const provinsi = await this.prisma.provinsi.findMany();

      return new SuccessResponseService({ data: provinsi });
    } catch (error) {
      this.errorExecption.resp(error);
    }
  }
}
