import { Injectable } from '@nestjs/common';
import { HashAlgorithm, VNPay, ignoreLogger } from 'vnpay';

export type VNPayReturnQuery = Record<string, unknown>;

export interface VNPayCreatePaymentDto {
  orderCode: number | string;
  amount: number;
  orderDescription: string;
  returnUrl: string;
  ipAddress: string;
}

export interface VNPayCallbackData {
  isSuccess?: boolean;
  isVerified?: boolean;
  message?: string;
  vnp_Amount?: number;
  vnp_BankCode?: string;
  vnp_BankTranNo?: string;
  vnp_CardType?: string;
  vnp_OrderInfo?: string;
  vnp_PayDate?: string;
  vnp_ResponseCode?: string | number;
  vnp_TMNCode?: string;
  vnp_TransactionNo?: string;
  vnp_TransactionStatus?: string | number;
  vnp_TxnRef?: string;
  vnp_SecureHash?: string;
  [key: string]: unknown;
}

@Injectable()
export class VNPayService {
  private readonly client = new VNPay({
    tmnCode: process.env.VNP_TMNCODE || '',
    secureSecret: process.env.VNP_HASH_SECRET || '',
    vnpayHost: process.env.VNP_URL
      ? new URL(process.env.VNP_URL).origin
      : 'https://sandbox.vnpayment.vn',
    testMode: true,
    hashAlgorithm: HashAlgorithm.SHA512,
    enableLog: false,
    loggerFn: ignoreLogger,
    endpoints: {
      paymentEndpoint: 'paymentv2/vpcpay.html',
      queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
      getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
    },
  });

  /**
   * Generate VNPay payment URL
   */
  createPaymentUrl(data: VNPayCreatePaymentDto): string {
    const { orderCode, amount, orderDescription, returnUrl, ipAddress } = data;

    return this.client.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_IpAddr: ipAddress,
      vnp_ReturnUrl: returnUrl,
      vnp_TxnRef: String(orderCode),
      vnp_OrderInfo: orderDescription,
    });
  }

  /**
   * Verify VNPay return URL signature
   */
  verifyReturnUrl(query: VNPayReturnQuery): VNPayCallbackData {
    return this.client.verifyReturnUrl(query as never) as VNPayCallbackData;
  }

  /**
   * Verify VNPay IPN callback
   */
  verifyIpnCall(query: VNPayReturnQuery): VNPayCallbackData {
    return this.client.verifyIpnCall(query as never) as VNPayCallbackData;
  }

  /**
   * Check if transaction is successful
   */
  isTransactionSuccessful(data: VNPayCallbackData): boolean {
    return (
      String(data.vnp_ResponseCode) === '00' &&
      String(data.vnp_TransactionStatus) === '00'
    );
  }
}
