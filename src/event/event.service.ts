import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
// import { PrismaService } from 'src/db/prisma.service'; // local
import { PrismaService } from '../db/prisma.service'; // prod -> vercel
import { ErrorExecptionService } from 'src/helpers/error-execption/error.service';
import { SuccessResponseService } from 'src/helpers/success-response/success.service';
import moment from 'moment';
import 'moment/locale/id'; // without this line it didn't work
import { UtilsService } from 'src/helpers/utils/utils.service';
import { role_user, status_acara } from '@prisma/client';
moment.locale('id');

@Injectable()
export class EventService {
  constructor(
    private prisma: PrismaService,
    private errorExecption: ErrorExecptionService,
    private utils: UtilsService,
  ) {}
  async create(createEventDto: CreateEventDto) {
    try {
      await this.prisma.acara.create({
        data: {
          ...createEventDto,
          waktu_acara: new Date(createEventDto.waktu_acara).toISOString(),
        },
      });

      return new SuccessResponseService();
    } catch (error) {
      return this.errorExecption.resp(error);
    }
  }

  async findAll(token: string) {
    try {
      const decodeToken = this.utils.decodeToken(token);

      const listEvent = await this.prisma.acara.findMany({
        ...(decodeToken?.role !== role_user.admin && {
          where: {
            ...(decodeToken?.role === role_user.penyelenggara && {
              user: { id: decodeToken?.id },
            }),
            ...(decodeToken?.role === role_user.customer && {
              status: status_acara.publish,
            }),
          },
        }),
        orderBy: { waktu_acara: 'asc' },
        select: {
          id: true,
          nama_acara: true,
          user: { select: { id: true, nama: true } },
          kategori: { select: { id: true, nama_kategori: true } },
          waktu_acara: true,
          deskripsi: true,
          status: true,
          provinsi: { select: { id: true, nama: true } },
          kabupatenkota: { select: { id: true, nama: true } },
          alamat: true,
          banner_img: true,
          map_tiket_img: true,
        },
      });

      const sendResp = listEvent.map((data) => {
        let allData = {
          ...data,
          // kategori: data.kategori?.nama_kategori,
          penyelenggara: data.user,
          waktu_acara: moment(data.waktu_acara).format('YYYY-MM-DD HH:mm:ss'),
        };

        delete (allData as any).user;

        return allData;
      });

      return new SuccessResponseService({ data: sendResp });
    } catch (error) {
      return this.errorExecption.resp(error);
    }
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    try {
      const getStatusAcara = await this.prisma.acara.findUnique({
        select: { status: true },
        where: { id },
      });

      if (getStatusAcara?.status === 'publish') {
        return new MethodNotAllowedException(
          'cannot update because acara is publish',
        ).getResponse();
      } else {
        await this.prisma.acara.update({
          data: {
            ...updateEventDto,
            ...(updateEventDto.waktu_acara && {
              waktu_acara: new Date(
                updateEventDto.waktu_acara ?? '',
              ).toISOString(),
            }),
          },
          where: { id },
        });

        return new SuccessResponseService();
      }
    } catch (error) {
      return this.errorExecption.resp(error);
    }
  }

  async remove(id: number) {
    try {
      const getStatusAcara = await this.prisma.acara.findUnique({
        select: { status: true },
        where: { id },
      });

      if (getStatusAcara?.status === 'publish') {
        return new MethodNotAllowedException(
          'cannot delete because acara is publish',
        ).getResponse();
      } else {
        await this.prisma.acara.delete({
          where: { id },
        });

        return new SuccessResponseService();
      }
    } catch (error) {
      return this.errorExecption.resp(error);
    }
  }
}
