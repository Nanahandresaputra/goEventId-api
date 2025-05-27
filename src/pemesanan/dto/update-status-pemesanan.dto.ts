import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateStatusPemesananDto {
  @IsNotEmpty()
  @IsString()
  kode_pemesanan: string;
}
