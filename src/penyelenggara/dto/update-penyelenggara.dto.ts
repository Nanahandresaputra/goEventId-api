import { PartialType } from '@nestjs/mapped-types';
import { CreatePenyelenggaraDto } from './create-penyelenggara.dto';

export class UpdatePenyelenggaraDto extends PartialType(CreatePenyelenggaraDto) {}
