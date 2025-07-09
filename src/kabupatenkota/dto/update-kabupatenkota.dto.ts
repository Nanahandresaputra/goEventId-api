import { PartialType } from '@nestjs/mapped-types';
import { CreateKabupatenkotaDto } from './create-kabupatenkota.dto';

export class UpdateKabupatenkotaDto extends PartialType(CreateKabupatenkotaDto) {}
