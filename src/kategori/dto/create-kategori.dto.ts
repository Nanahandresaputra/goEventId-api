import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateKategoriDto {
  @IsNotEmpty()
  @IsString()
  nama_kategori: string;
}
