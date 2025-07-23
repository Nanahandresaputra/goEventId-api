import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCheckInDto } from './dto/create-check-in.dto';
import { UpdateCheckInDto } from './dto/update-check-in.dto';
import { ErrorExecptionService } from 'src/helpers/error-execption/error.service';
import { PrismaService } from 'src/db/prisma.service';
import { status_order } from '@prisma/client';
import { SuccessResponseService } from 'src/helpers/success-response/success.service';

@Injectable()
export class CheckInService {
  constructor(
    private errorExecption: ErrorExecptionService,
    private prisma: PrismaService,
  ) {}
  async create(createCheckInDto: CreateCheckInDto) {
    try {
      const getStatusOrder = await this.prisma.order.findFirst({
        where: { kode_order: createCheckInDto.kode_order },
      });

      if (getStatusOrder?.status === status_order.belum_digunakan) {
        await this.prisma.order.updateMany({
          data: {
            status: status_order.digunakan,
          },
          where: { kode_order: createCheckInDto.kode_order },
        });
        return new SuccessResponseService();
      } else if (getStatusOrder?.status === status_order.digunakan) {
        return new BadRequestException('ticket already used!').getResponse();
      } else {
        return new NotFoundException().getResponse();
      }
    } catch (error) {
      return this.errorExecption.resp(error);
    }
  }
}
