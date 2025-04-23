import { Global, Module } from '@nestjs/common';
import { ErrorExecptionService } from './error.service';

@Global()
@Module({
  imports: [ErrorExecptionService],
  // providers: [SuccessResponseService],
  // exports: [SuccessResponseService],
})
export class ErrorExecptionModule {}
