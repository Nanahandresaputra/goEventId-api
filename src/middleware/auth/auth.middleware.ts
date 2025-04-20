import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { role_user } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';
import { UtilsService } from 'src/helpers/utils/utils.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private utils: UtilsService,
  ) {}
  async use(req: Request, res: Response, next: () => void) {
    const token = req.headers['token'];

    if (!token) {
      throw new UnauthorizedException('Authorization token is missing');
    } else {
      try {
        let authValue = await this.prisma.auth.findFirst({ where: { token } });

        if (!authValue?.token) {
          throw new UnauthorizedException();
        } else {
          const Uri = req.url.replace('/goEventId/api/v1/', '');
          const fullUri = req.url;

          const superAdminRoute = ['user'].map((path) => `${Uri}/${path}`);

          if (this.utils.decodeToken(token)?.role === role_user.superAdmin) {
            if (superAdminRoute.includes(fullUri)) {
              console.log('trieggerer');
              next();
            } else {
              throw new ForbiddenException();
            }
          }
        }

        return next();
      } catch (error) {
        console.log(error.name);

        if (error.name === 'UnauthorizedException') {
          throw new UnauthorizedException();
        } else {
          throw new BadRequestException();
        }
      }
    }

    // next();
  }
}
