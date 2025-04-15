import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  create(registerDto: RegisterDto) {
    return 'This action adds a new auth';
  }

  update(LoginDto: LoginDto) {
    return `This action updates a  auth`;
  }
}
