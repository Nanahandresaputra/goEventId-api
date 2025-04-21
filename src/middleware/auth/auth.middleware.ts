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
    const token: string = req.headers['token'];

    if (!token) {
      throw new UnauthorizedException('Authorization token is missing');
    } else {
      try {
        const authValue = await this.prisma.auth.findFirst({
          where: { token },
        });

        if (!authValue?.token) {
          throw new UnauthorizedException();
        } else {
          const fullUri = req.url;

          const superAdminRoute = ['users'].map(
            (path) => `/goEventId/api/v1/${path}`,
          );

          if (this.utils.decodeToken(token)?.role === role_user.superAdmin) {
            if (superAdminRoute.includes(fullUri)) {
              return next();
            } else {
              throw new ForbiddenException();
            }
          } else {
            throw new ForbiddenException();
          }
        }

        // return next();
      } catch (error) {
        if (error.name === 'UnauthorizedException') {
          throw new UnauthorizedException();
        } else if (error.name === 'ForbiddenException') {
          throw new ForbiddenException();
        } else {
          throw new BadRequestException();
        }
      }
    }

    // next();
  }
}
