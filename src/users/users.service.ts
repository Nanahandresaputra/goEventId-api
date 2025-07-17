import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/db/prisma.service';
import { SuccessResponseService } from 'src/helpers/success-response/success.service';
import { Prisma, role_user } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UtilsService } from 'src/helpers/utils/utils.service';
import { ErrorExecptionService } from 'src/helpers/error-execption/error.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private utils: UtilsService,
    private errorExecption: ErrorExecptionService,
  ) {}

  async create(userData: CreateUserDto) {
    try {
      const hashPassword: string = this.utils.encryptPwd(userData.password);

      const sendValue: Prisma.UserCreateInput = {
        ...userData,
        password: hashPassword,
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
      const listUsers = await this.prisma.user.findMany({
        where: {
          OR: [
            // {
            //   role: role_user.superAdmin,
            // },
            {
              role: role_user.admin,
            },
          ],
        },
      });

      return new SuccessResponseService({
        data: listUsers.map((user) => ({
          id: user.id,
          nama: user.nama,
          email: user.email,
          status: user.status,
          role: user.role,
        })),
      });
    } catch (error) {
      return this.errorExecption.resp(error);
    }
  }

  // async findOne(id: number) {
  //   try {
  //     const user = await this.prisma.user.findUnique({ where: { id } });

  //     return new SuccessResponseService({
  //       data: {
  //         id: user?.id,
  //         nama: user?.nama,
  //         username: user?.username,
  //         email: user?.email,
  //         status: user?.status,
  //         role: user?.role,
  //       },
  //     });
  //   } catch (error) {
  //     return new InternalServerErrorException().getResponse();
  //   }
  // }

  async update(id: number, userData: UpdateUserDto) {
    try {
      await this.prisma.user.update({ data: userData, where: { id } });

      return new SuccessResponseService();
    } catch (error) {
      return this.errorExecption.resp(error);
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.user.delete({ where: { id } });

      return new SuccessResponseService();
    } catch (error) {
      return this.errorExecption.resp(error);
    }
  }
}
