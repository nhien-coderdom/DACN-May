declare module 'vnpay' {
  export enum HashAlgorithm {
    MD5 = 'MD5',
    SHA256 = 'SHA256',
    SHA512 = 'SHA512'
  }

  export class VNPay {
    constructor(config: any);
    buildPaymentUrl(data: any): string;
    verifyReturnUrl(query: any): any;
    verifyIpnCall(query: any): any;
  }

  export const ignoreLogger: any;
}