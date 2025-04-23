import { Global, Module } from '@nestjs/common';
import { ErrorExecptionService } from './error.service';

@Global()
@Module({
  // imports: [ErrorExecptionService],
  providers: [ErrorExecptionService],
  exports: [ErrorExecptionService],
})
export class ErrorExecptionModule {}
