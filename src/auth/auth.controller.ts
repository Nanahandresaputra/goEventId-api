import { Controller, Post, Body, Patch, Delete, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
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
    },
  ) {
    return this.authService.register({
      ...registerData,
      role: role_user.customer,
      status: 1,
    });
  }

  @Post('login')
  login(@Body() loginData: { username: string; password: string }) {
    return this.authService.login(loginData);
  }

  @Delete('logout')
  logout(@Headers() headers: { token: string }) {
    return this.authService.logout(headers);
  }
}
