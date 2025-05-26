import { Controller, Post, Body, Patch, Delete, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Body()
    registerData: RegisterDto,
  ) {
    return this.authService.register(registerData);
  }

  @Post('login')
  login(@Body() loginData: LoginDto) {
    return this.authService.login(loginData);
  }

  @Delete('logout')
  logout(@Headers() headers: { token: string }) {
    return this.authService.logout(headers);
  }
}
