import { Role } from 'src/helpers/global-types';

export class RegisterDto {
  nama: string;
  username: string;
  email: string;
  password: string;
  status: number;
  role: Role;
}
