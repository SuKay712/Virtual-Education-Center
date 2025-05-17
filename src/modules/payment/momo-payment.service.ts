import {
  ConsoleLogger,
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../../entities/account.entity';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { BillService } from '../bill/bill.service';
import { ClassService } from '../class/class.service';
import axios from 'axios';
import {
  CurrentAccount,
} from '../../common';
import { log } from 'console';
import { BillPaymentMethodEnum } from '../../common/enums/bill-payment-method.enum';
import { BillRequestDto } from '../bill/dtos/billRequestDtos';
import { BillStatusEnum } from '../../common/enums/bill-status.enum';
import * as CryptoJS from 'crypto-js';
import * as crypto from 'crypto';

@Injectable()
export class MomoPaymentService {
  private readonly accessKey: string;
  private readonly secretKey: string;
  private readonly partnerCode: string;
  private readonly returnUrl: string;
  private readonly ipnUrl: string;
  private readonly refundUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly billService: BillService,
    private readonly classService: ClassService,
  ) {
    this.accessKey = this.configService.get<string>('MOMO_ACCESS_KEY');
    this.secretKey = this.configService.get<string>('MOMO_SECRET_KEY');
    this.partnerCode = this.configService.get<string>('MOMO_PARTNER_CODE');
    this.returnUrl = this.configService.get<string>('MOMO_RETURN_URL');
    this.ipnUrl = this.configService.get<string>('MOMO_IPN_URL');
    this.refundUrl = this.configService.get<string>('MOMO_REFUND_URL');
  }

  private async refundPayment(
    transId: string,
    amount: number,
  ): Promise<any> {
    const accessKey = this.configService.get<string>('MOMO_ACCESS_KEY');
    const secretKey = this.configService.get<string>('MOMO_SECRET_KEY');
    const momoRefundEndpoint = this.configService.get<string>('MOMO_ENDPOINT_REFUND');
    const partnerCode = 'MOMO';
    const requestId = partnerCode + new Date().getTime();
    const orderId = requestId;
    const description = 'refund';

    // Tạo chuỗi raw signature theo đúng format của MoMo
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&description=${description}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}&transId=${transId}`;

    const signature = CryptoJS.HmacSHA256(rawSignature, secretKey).toString(CryptoJS.enc.Hex);

    const requestBody = {
      partnerCode: partnerCode,
      requestId: requestId,
      amount: amount,
      transId: transId,
      orderId: orderId,
      description: description,
      signature: signature,
      lang: 'vi'
    };

    console.log('Raw signature:', rawSignature);
    console.log('Request body:', requestBody);

    try {
      const response = await axios.post(momoRefundEndpoint, requestBody);
      return response.data;
    } catch (error: any) {
      console.error('Refund error:', error.response?.data || error.message);
      throw error;
    }
  }

  async createPayment(billRequest: BillRequestDto, account: Account) {
    const deployedLink = this.configService.get<string>('DEPLOY_SERVICE_LINK_NGROK');
    const accessKey = this.configService.get<string>('MOMO_ACCESS_KEY');
    const secretKey = this.configService.get<string>('MOMO_SECRET_KEY');
    const momoEndpoint = this.configService.get<string>('MOMO_ENDPOINT_CREATE');

    console.log('Environment variables:', {
      deployedLink,
      accessKey,
      secretKey,
      momoEndpoint
    });

    const partnerCode = 'MOMO';
    const requestType = 'payWithMethod';
    const billId = partnerCode + new Date().getTime();
    const requestId = billId;

    const bill = await this.billService.createBill(account, {
      ...billRequest,
      paymentMethod: BillPaymentMethodEnum.MOMO,
    });

    const dataCallback = [
      {
        bill,
        ...billRequest,
        paymentMethod: BillPaymentMethodEnum.MOMO,
        currentAccount: account,
        isPaid: true,
        paymentCode: billId,
      },
    ];

    const extraData = Buffer.from(JSON.stringify(dataCallback)).toString('base64');

    // Tạo chuỗi raw signature theo đúng thứ tự của MoMo
    const rawSignature = [
      'accessKey=' + accessKey,
      'amount=' + (bill.course.price * 1000),
      'extraData=' + extraData,
      'ipnUrl=' + `${deployedLink}/momo-payment/callback`,
      'orderId=' + billId,
      'orderInfo=' + `Course Payment - Bill #${bill.course.name}`,
      'partnerCode=' + this.partnerCode,
      'redirectUrl=' + `http://localhost:3000/student/course`,
      'requestId=' + requestId,
      'requestType=' + requestType
    ].join('&');


    const signature = CryptoJS.HmacSHA256(rawSignature, secretKey).toString(CryptoJS.enc.Hex);

    const requestBody = {
      partnerCode: partnerCode,
      requestId: requestId,
      amount: bill.course.price * 1000,
      orderId: billId,
      orderInfo: `Course Payment - Bill #${bill.course.name}`,
      redirectUrl: `http://localhost:3000/student/course`,
      ipnUrl: `${deployedLink}/momo-payment/callback`,
      extraData: extraData,
      requestType: requestType,
      signature: signature,
      lang: 'vi',
    };

    try {
      const response = await axios.post(
        momoEndpoint,
        requestBody,
      );
      return response.data;
    } catch (error: any) {
      console.error('Payment error:', error.response?.data || error.message);
      throw new Error(`Payment creation failed: ${error.message}`);
    }
  }

  async callback(req: any) {
    const response = req.body;
    console.log('--------------------PAYMENT CALLBACK----------------');
    console.log('Response from MoMo:', response);

    try {
      if (response && response.resultCode === 0) {
        console.log('Payment Successful');

        const extraData = response.extraData
          ? JSON.parse(Buffer.from(response.extraData, 'base64').toString())
          : null;
        console.log('Extra Data:', extraData);

        if (extraData && extraData[0]) {
          const billData = extraData[0].bill;
          const billRequest = extraData[0];
          const currentAccount = extraData[0].currentAccount;

          if (billData.id) {
            try {
              await this.classService.createClassesForCourse(
                billRequest.courseId,
                currentAccount.id,
                billRequest.time_start,
                billRequest.time_end,
                billRequest.day_of_week,
              );
              console.log('Classes created successfully');
              await this.billService.updateBillStatus(billData.id, BillStatusEnum.PAID, extraData[0].paymentCode);
              console.log('Bill status updated to PAID');
            } catch (classError) {
              console.error('Error creating classes:', classError);

              try {
                // Đợi 5 giây để đảm bảo giao dịch thanh toán đã hoàn tất
                await new Promise(resolve => setTimeout(resolve, 5000));

                const refundResult = await this.refundPayment(
                  response.transId,
                  response.amount,
                );
                console.log('Refund result:', refundResult);

                if (refundResult.resultCode === 0) {
                  await this.billService.updateBillStatus(
                    billData.id,
                    BillStatusEnum.CANCELLED,
                    extraData[0].paymentCode
                  );
                  console.log('Refund successful after class creation failure');
                } else {
                  console.error('Refund failed after class creation failure:', refundResult.message);
                }
              } catch (refundError) {
                console.error('Error during refund after class creation failure:', refundError);
              }

              throw new Error(`Failed to create classes: ${classError instanceof Error ? classError.message : 'Unknown error'}. Refund process initiated.`);
            }
          } else {
            console.error('Bill ID not found in extraData');
          }
        } else {
          console.error('Invalid extraData format');
        }
      } else {
        console.log('Payment Failed:', response?.message || 'Unknown error');
      }

      return {
        resultCode: response?.resultCode || -1,
        message: response?.message || 'Success'
      };
    } catch (error) {
      console.error('Error processing callback:', error);
      return {
        resultCode: -1,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
