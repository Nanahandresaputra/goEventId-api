import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/db/prisma.service';
import { encryptPwd } from 'src/helpers/bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  create(registerDto: RegisterDto) {
    return 'This action adds a new auth';

    // try {
    //   const hashPassword: string = encryptPwd(registerDto.password);

    //   const sendValue: RegisterDto = { ...registerDto, password: hashPassword };

    //   await this.prisma.user.create({ data: sendValue });
    // } catch (error) {
    //   console.log(error);
    // }
  }

  update(LoginDto: LoginDto) {
    return `This action updates a  auth`;
  }
}
