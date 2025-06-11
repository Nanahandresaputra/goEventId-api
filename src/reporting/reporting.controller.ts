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
import { ReportingService } from './reporting.service';
import { CreateReportingDto } from './dto/create-reporting.dto';
import { UpdateReportingDto } from './dto/update-reporting.dto';

@Controller('reporting')
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Get()
  findAll(@Headers() headers: { token: string }) {
    return this.reportingService.findAll(headers.token);
  }
}
