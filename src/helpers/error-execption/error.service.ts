import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class ErrorExecptionService {
  constructor() {}

  resp(error: any) {
    console.log({ error });
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const getTarget: any = error?.meta?.target;
        return new BadRequestException(
          getTarget?.map((target: string[]) => `${target} already used!`),
        ).getResponse();
      } else if (error.code === 'P2025') {
        const getCause: any = error?.meta?.cause;
        return new BadRequestException(getCause).getResponse();
      } else {
        return new BadRequestException().getResponse();
      }
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      return new BadRequestException().getResponse();
    } else {
      return new InternalServerErrorException().getResponse();
    }
  }
}
