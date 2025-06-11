import { Injectable } from '@nestjs/common';
import { CreatePenyelenggaraDto } from './dto/create-penyelenggara.dto';
import { UpdatePenyelenggaraDto } from './dto/update-penyelenggara.dto';
import { PrismaService } from 'src/db/prisma.service';
import { UtilsService } from 'src/helpers/utils/utils.service';
import { ErrorExecptionService } from 'src/helpers/error-execption/error.service';
import { Prisma } from '@prisma/client';
import { SuccessResponseService } from 'src/helpers/success-response/success.service';
import * as moment from 'moment';
import 'moment/locale/id'; // without this line it didn't work
moment.locale('id');

@Injectable()
export class PenyelenggaraService {
  constructor(
    private prisma: PrismaService,
    private utils: UtilsService,
    private errorExecption: ErrorExecptionService,
  ) {}
  async create(createPenyelenggaraDto: CreatePenyelenggaraDto) {
    try {
      const hashPassword: string = this.utils.encryptPwd(
        createPenyelenggaraDto.password,
      );

      const sendValue: Prisma.UserCreateInput = {
        ...createPenyelenggaraDto,
        password: hashPassword,
        role: 'penyelenggara',
        status: 1,
      };

      await this.prisma.user.create({ data: sendValue });

      return new SuccessResponseService();
    } catch (error) {
      return this.errorExecption.resp(error);
    }
  }

  async findAll() {
    try {
      const listPenyelenggara = await this.prisma.user.findMany({
        where: { role: 'penyelenggara' },
        select: {
          id: true,
          nama: true,
          email: true,
          status: true,
          role: true,
          acara: {
            select: { nama_acara: true, waktu_acara: true, status: true },
          },
        },
      });
      const sendResp = listPenyelenggara.map((datas) => ({
        ...datas,
        acara: datas.acara.map((data) => ({
          ...data,
          waktu_acara: moment(data.waktu_acara).format('YYYY-MM-DD HH:mm:ss'),
        })),
      }));
      return new SuccessResponseService({ data: sendResp });
    } catch (error) {
      return this.errorExecption.resp(error);
    }
  }

  async update(id: number, updatePenyelenggaraDto: UpdatePenyelenggaraDto) {
    try {
      await this.prisma.user.update({
        data: updatePenyelenggaraDto,
        where: { id },
      });

      return new SuccessResponseService();
    } catch (error) {
      return this.errorExecption.resp(error);
    }
  }
}
