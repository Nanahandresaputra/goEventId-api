import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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
        return new InternalServerErrorException(
          'Internal Server Error',
        ).getResponse();
      }
    }
  }

  async findAll() {
    // return `This action returns all users`;

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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
