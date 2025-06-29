import {
  BadRequestException,
  Injectable,
  MethodNotAllowedException,
} from '@nestjs/common';
import { CreateTiketAcaraDto } from './dto/create-tiket_acara.dto';
import { UpdateTiketAcaraDto } from './dto/update-tiket_acara.dto';
import { PrismaService } from 'src/db/prisma.service';
import { ErrorExecptionService } from './../helpers/error-execption/error.service';
import { SuccessResponseService } from 'src/helpers/success-response/success.service';

@Injectable()
export class TiketAcaraService {
  constructor(
    private prisma: PrismaService,
    private errorExecption: ErrorExecptionService,
  ) {}
  async create(createTiketAcaraDto: CreateTiketAcaraDto) {
    try {
      await this.prisma.tiket_Acara.create({
        data: { ...createTiketAcaraDto },
      });

      return new SuccessResponseService();
    } catch (error) {
      return this.errorExecption.resp(error);
    }
  }

  async findAll(acara_id: number) {
    try {
      const listTiket = await this.prisma.tiket_Acara.findMany({
        where: { acara_id },
        select: {
          id: true,
          acara: {
            select: {
              kategori: { select: { nama_kategori: true } },
              nama_acara: true,
            },
          },
          tipe_tiket: true,
          kuota: true,
          tiket_terjual: true,
          harga_tiket: true,
        },
      });

      const sendRespData = listTiket.map((data) => ({
        ...data,
        acara: data.acara.nama_acara,
        kategori: data.acara.kategori?.nama_kategori,
        stok_tersisa: +data.kuota - +data.tiket_terjual,
      }));

      return new SuccessResponseService({ data: sendRespData });
    } catch (error) {
      this.errorExecption.resp(error);
    }
  }

  async update(id: number, updateTiketAcaraDto: UpdateTiketAcaraDto) {
    try {
      const getStatusAcara = await this.prisma.tiket_Acara.findUnique({
        select: { acara: { select: { status: true } } },
        where: { id },
      });

      if (getStatusAcara?.acara.status === 'publish') {
        return new MethodNotAllowedException(
          'cannot update because acara is publish',
        ).getResponse();
      } else {
        await this.prisma.tiket_Acara.update({
          data: { ...updateTiketAcaraDto },
          where: { id },
        });

        return new SuccessResponseService();
      }
    } catch (error) {
      this.errorExecption.resp(error);
    }
  }

  async remove(id: number) {
    try {
      const getStatusAcara = await this.prisma.tiket_Acara.findUnique({
        select: { acara: { select: { status: true } } },
        where: { id },
      });

      if (getStatusAcara?.acara.status === 'publish') {
        return new MethodNotAllowedException(
          'cannot delete because acara is publish',
        ).getResponse();
      } else {
        await this.prisma.tiket_Acara.delete({ where: { id } });
        return new SuccessResponseService();
      }
    } catch (error) {
      this.errorExecption.resp(error);
    }
  }
}
