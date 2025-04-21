import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { checkEncrypt, encryptPwd } from 'src/helpers/utils/bcrypt';
import { Prisma } from '@prisma/client';
import { SuccessResponseService } from 'src/helpers/success-response/success.service';
import { JwtService } from '@nestjs/jwt';
import { config } from 'src/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private successResp: SuccessResponseService,
    private jwtService: JwtService,
  ) {}
  async register(registerData: Prisma.UserCreateInput) {
    try {
      const hashPassword: string = encryptPwd(registerData.password);

      const sendValue: Prisma.UserCreateInput = {
        ...registerData,
        password: hashPassword,
      };

      await this.prisma.user.create({ data: sendValue });

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

  async login(loginData: { username: string; password: string }) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          username: loginData.username,
        },
      });

      if (user?.password && checkEncrypt(loginData.password, user?.password)) {
        const token = this.jwtService.sign(
          {
            id: user.id,
            name: user.nama,
            role: user.role,
          },
          { secret: config.secretKey },
        );

        const createAuth = await this.prisma.auth.create({
          data: { user_id: user.id, token },
        });

        return this.successResp.response({
          token: createAuth.token,
        });
      } else {
        return new UnauthorizedException(
          'username or password invalid!',
        ).getResponse();
      }
    } catch (error) {
      console.log({ error });
      if (error.name === 'PrismaClientValidationError') {
        return new BadRequestException().getResponse();
      } else {
        return new InternalServerErrorException(
          'Internal Server Error',
        ).getResponse();
      }
    }
  }

  async logout(logoutData: { token: string }) {
    try {
      await this.prisma.auth.deleteMany({ where: { token: logoutData.token } });

      return this.successResp.response();
    } catch (error) {
      if (error.name === 'PrismaClientValidationError') {
        return new BadRequestException().getResponse();
      } else {
        return new InternalServerErrorException(
          'Internal Server Error',
        ).getResponse();
      }
    }
  }
}
