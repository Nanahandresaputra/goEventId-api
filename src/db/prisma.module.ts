import { Global, Module } from '@nestjs/common';

// import { PrismaService } from 'src/db/prisma.service'; // local
import { PrismaService } from './prisma.service'; // prod -> vercel
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
