import { Global, Module } from '@nestjs/common';
import { SuccessResponseService } from './success.service';

@Global()
@Module({
  providers: [SuccessResponseService],
  exports: [SuccessResponseService],
})
export class SuccessResponseModule {}
