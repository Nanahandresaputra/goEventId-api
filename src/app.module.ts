import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './db/prisma.module';
import { SuccessResponseModule } from './helpers/success-response/success.module';
import { JwtModule } from '@nestjs/jwt';
import { config } from './config';
import { AuthMiddleware } from './middleware/auth/auth.middleware';
import { UtilsModule } from './helpers/utils/utils.module';
import { KategoriModule } from './kategori/kategori.module';
import { ErrorExecptionModule } from './helpers/error-execption/error.module';
import { EventModule } from './event/event.module';
import { PemesananModule } from './pemesanan/pemesanan.module';
import { TiketAcaraModule } from './tiket_acara/tiket_acara.module';
import { ReportingModule } from './reporting/reporting.module';
import { RiwayatModule } from './riwayat/riwayat.module';
import { PenyelenggaraModule } from './penyelenggara/penyelenggara.module';
import { ProvinsiModule } from './provinsi/provinsi.module';
import { KabupatenkotaModule } from './kabupatenkota/kabupatenkota.module';
import { CheckInModule } from './check-in/check-in.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PrismaModule,
    SuccessResponseModule,
    ErrorExecptionModule,
    JwtModule.register({
      global: true,
      secret: config.secretKey,
    }),
    // CaslModule.forRoot<AbilityFactory>({
    //   abilityFactory: AbilityFactory,
    // }),
    UtilsModule,
    KategoriModule,
    EventModule,
    PemesananModule,
    TiketAcaraModule,
    ReportingModule,
    RiwayatModule,
    PenyelenggaraModule,
    ProvinsiModule,
    KabupatenkotaModule,
    CheckInModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('auth/login', 'auth/register', '/check-in')
      .forRoutes({
        path: '*path',
        method: RequestMethod.ALL,
      });
  }
}
