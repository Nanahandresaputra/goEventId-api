import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTiketAcaraDto {
  @IsNumber()
  @IsNotEmpty()
  acara_id: number;

  @IsString()
  @IsNotEmpty()
  tipe_tiket: string;

  @IsNumber()
  @IsNotEmpty()
  kuota: number;

  @IsNumber()
  @IsOptional()
  tiket_terjual: number;

  @IsNumber()
  @IsNotEmpty()
  harga_tiket: number;
}
