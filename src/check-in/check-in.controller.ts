import { Controller, Post, Body } from '@nestjs/common';
import { CheckInService } from './check-in.service';
import { CreateCheckInDto } from './dto/create-check-in.dto';

@Controller('check-in')
export class CheckInController {
  constructor(private readonly checkInService: CheckInService) {}

  @Post()
  create(@Body() createCheckInDto: CreateCheckInDto) {
    return this.checkInService.create(createCheckInDto);
  }
}
