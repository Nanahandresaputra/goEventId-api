import { PartialType } from '@nestjs/mapped-types';
import { CreateTiketAcaraDto } from './create-tiket_acara.dto';

export class UpdateTiketAcaraDto extends PartialType(CreateTiketAcaraDto) {}
