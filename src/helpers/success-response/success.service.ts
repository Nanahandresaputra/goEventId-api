import { HttpStatus, Injectable } from '@nestjs/common';

interface RespData {
  data?: any;
  message?: string;
  statusCode?: HttpStatus;
  token?: any;
}

@Injectable()
export class SuccessResponseService {
  response(respData?: RespData) {
    return {
      message: respData?.message ? respData?.message : 'success',
      ...(respData?.data?.length && { data: respData?.data }),
      statusCode: HttpStatus.OK,
      ...(respData?.token && { token: respData?.token }),
    };
  }
}
