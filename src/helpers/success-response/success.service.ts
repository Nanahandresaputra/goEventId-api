import { HttpStatus, Injectable } from '@nestjs/common';

interface RespData {
  data?: any;
  message?: string;
  statusCode?: HttpStatus;
  token?: any;
}

// @Injectable()
export class SuccessResponseService {
  constructor(private respData?: RespData) {
    return {
      message: this.respData?.message ? this.respData?.message : 'success',
      ...(this.respData?.data && { data: this.respData?.data }),
      statusCode: HttpStatus.OK,
      ...(this.respData?.token && { token: this.respData?.token }),
    };
  }
  // response(respData?: RespData) {
  //   return {
  //     message: this.respData?.message ? this.respData?.message : 'success',
  //     ...(this.respData?.data && { data: this.respData?.data }),
  //     statusCode: HttpStatus.OK,
  //     ...(this.respData?.token && { token: this.respData?.token }),
  //   };
  // }
}
