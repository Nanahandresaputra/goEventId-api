import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  nama_acara: string;

  @IsDateString()
  @IsNotEmpty()
  waktu_acara: string;

  @IsNumber()
  @IsNotEmpty()
  kategori_id: number;

  @IsNumber()
  @IsNotEmpty()
  user_id_penyelenggara: number;

  @IsOptional()
  @IsString()
  deskripsi: string;

  @IsNumber()
  @IsNotEmpty()
  provinsi_id: number;

  @IsNumber()
  @IsNotEmpty()
  kabupaten_kota_id: number;

  @IsNotEmpty()
  @IsString()
  alamat: string;

  @IsString()
  @IsNotEmpty()
  banner_img: string;

  @IsString()
  @IsNotEmpty()
  map_tiket_img: string;
}
