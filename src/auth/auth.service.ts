import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/db/prisma.service';
import { encryptPwd } from 'src/helpers/bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async create(registerData: Prisma.UserCreateInput) {
    // return 'This action adds a new auth';

    try {
      const hashPassword: string = encryptPwd(registerData.password);

      const sendValue: Prisma.UserCreateInput = {
        ...registerData,
        password: hashPassword,
      };

      await this.prisma.user.create({ data: sendValue });
    } catch (error) {
      console.log(error);
    }
  }

  update(LoginDto: LoginDto) {
    return `This action updates a  auth`;
  }
}
