import { Controller, Post, Body, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/update-auth.dto';
import { role_user } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Body()
    registerData: {
      nama: string;
      username: string;
      email: string;
      password: string;
      status: number;
      role: role_user;
    },
  ) {
    return this.authService.create(registerData);
  }

  @Patch()
  login(@Body() loginDto: LoginDto) {
    return this.authService.update(loginDto);
  }
}
