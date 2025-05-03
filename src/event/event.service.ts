import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/db/prisma.service';
import { ErrorExecptionService } from 'src/helpers/error-execption/error.service';
import { SuccessResponseService } from 'src/helpers/success-response/success.service';
import * as moment from 'moment';
import 'moment/locale/id'; // without this line it didn't work
moment.locale('id');

@Injectable()
export class EventService {
  constructor(
    private prisma: PrismaService,
    private errorExecption: ErrorExecptionService,
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

  async findAll() {
    try {
      const listEvent = await this.prisma.acara.findMany();

      const sendResp = listEvent.map((data) => ({
        ...data,
        waktu_acara: moment(data.waktu_acara).format('YYYY-MM-DD HH:mm:ss'),
      }));

      return new SuccessResponseService({ data: sendResp });
    } catch (error) {
      return this.errorExecption.resp(error);
    }
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    try {
      await this.prisma.acara.update({
        data: { ...updateEventDto },
        where: { id },
      });

      return new SuccessResponseService();
    } catch (error) {
      return this.errorExecption.resp(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
