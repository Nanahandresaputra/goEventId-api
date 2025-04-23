import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { checkEncrypt, encryptPwd } from 'src/helpers/utils/bcrypt';
import { Prisma, role_user } from '@prisma/client';
import { SuccessResponseService } from 'src/helpers/success-response/success.service';
import { JwtService } from '@nestjs/jwt';
import { config } from 'src/config';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ErrorExecptionService } from 'src/helpers/error-execption/error.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async register(registerData: RegisterDto) {
    try {
      const hashPassword: string = encryptPwd(registerData.password);

      const sendValue: Prisma.UserCreateInput = {
        ...registerData,
        password: hashPassword,
        role: role_user.customer,
        status: 1,
      };

      await this.prisma.user.create({ data: sendValue });

      return new SuccessResponseService();
    } catch (error) {
      return new ErrorExecptionService(error);
    }
  }

  async login(loginData: LoginDto) {
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

        return new SuccessResponseService({
          token: createAuth.token,
        });
      } else {
        return new UnauthorizedException(
          'username or password invalid!',
        ).getResponse();
      }
    } catch (error) {
      console.log(error.message);
      if (
        error.name === 'PrismaClientValidationError' ||
        `${error.message}`.includes('Illegal arguments')
      ) {
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

      return new SuccessResponseService();
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
