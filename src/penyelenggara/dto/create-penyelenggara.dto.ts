import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreatePenyelenggaraDto {
  @IsNotEmpty()
  @IsString()
  nama: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
