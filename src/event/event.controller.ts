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
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('acara')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Patch()
  update(
    @Headers() headers: { id: number },
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.update(+headers.id, updateEventDto);
  }

  @Delete()
  remove(@Headers() headers: { id: number }) {
    return this.eventService.remove(+headers.id);
  }
}
