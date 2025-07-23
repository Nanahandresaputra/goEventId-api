import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCheckInDto {
  @IsString()
  @IsNotEmpty()
  kode_order: string;
}
