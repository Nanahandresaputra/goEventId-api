import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    @Body()
    userData: CreateUserDto,
  ) {
    return this.usersService.create(userData);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  @Patch()
  update(
    // @Param('id') id: string,
    @Headers() headers: { id: number },
    @Body()
    userData: UpdateUserDto,
  ) {
    return this.usersService.update(+headers.id, userData);
  }

  @Delete()
  remove(@Headers() headers: { id: number }) {
    return this.usersService.remove(+headers.id);
  }
}
