import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/db/prisma.service';
import { SuccessResponseService } from 'src/helpers/success-response/success.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private successResp: SuccessResponseService,
  ) {}

  async create(userData: Prisma.UserCreateInput) {
    // return 'This action adds a new user';

    try {
      await this.prisma.user.create({ data: userData });

      return this.successResp.response();
    } catch (error) {
      if (error.name === 'PrismaClientValidationError') {
        return new BadRequestException().getResponse();
      } else if (error.name === 'PrismaClientKnownRequestError') {
        return new BadRequestException('Username already used!').getResponse();
      } else {
        return new InternalServerErrorException().getResponse();
      }
    }
  }

  async findAll() {
    try {
      const listUsers = await this.prisma.user.findMany();

      return this.successResp.response({
        data: listUsers.map((user) => ({
          id: user.id,
          nama: user.nama,
          username: user.username,
          email: user.email,
          status: user.status,
          role: user.role,
        })),
      });
    } catch (error) {
      return new InternalServerErrorException().getResponse();
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });

      return this.successResp.response({
        data: {
          id: user?.id,
          nama: user?.nama,
          username: user?.username,
          email: user?.email,
          status: user?.status,
          role: user?.role,
        },
      });
    } catch (error) {
      return new InternalServerErrorException().getResponse();
    }
  }

  async update(userData: any) {
    try {
      const sendData: Prisma.UserUpdateInput = {
        nama: userData.nama,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: userData.role,
      };

      const user = await this.prisma.user.findUnique({
        where: { id: userData.id },
      });

      if (user?.id) {
        this.prisma.user.update({ data: sendData, where: { id: userData.id } });

        return this.successResp.response();
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      console.log(error);
      if (error.name === 'PrismaClientValidationError') {
        return new BadRequestException().getResponse();
      } else if (error.name === 'PrismaClientKnownRequestError') {
        return new BadRequestException('Username already used!').getResponse();
      } else {
        return new InternalServerErrorException().getResponse();
      }
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
