import { HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { config } from 'src/config';

@Injectable()
export class UtilsService {
  constructor(private jwtService: JwtService) {}
  encryptPwd(pwd: string): string {
    const salt: string = bcrypt.genSaltSync(10);
    const hash: string = bcrypt.hashSync(pwd, salt);

    return hash;
  }

  checkEncrypt(pwd: string, hash: string): boolean {
    // const salt: string = bcrypt.genSaltSync(10);
    // const hash: string = bcrypt.hashSync(pwd, salt);

    const compared: boolean = bcrypt.compareSync(pwd, hash);

    return compared;
  }

  decodeToken(token: string) {
    return this.jwtService.verify(token, {
      secret: config.secretKey,
    });
  }

  userIdTkn(token: string) {
    return this.decodeToken(token)?.id;
  }
}
