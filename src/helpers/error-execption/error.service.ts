import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

// @Injectable()
export class ErrorExecptionService {
  constructor(private error: any) {
    if (this.error instanceof Prisma.PrismaClientKnownRequestError) {
      if (this.error.code === 'P2002') {
        const getTarget: any = this.error?.meta?.target;
        throw new BadRequestException(
          getTarget?.map((target) => `${target} already used!`),
        );
      } else {
        throw new BadRequestException();
      }
    } else {
      throw new InternalServerErrorException();
    }
  }
}
