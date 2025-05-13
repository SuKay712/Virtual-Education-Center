import {
  ConsoleLogger,
  ForbiddenException,
  Injectable,
  NotFoundException,
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

@Injectable()
export class MomoPaymentService {
  constructor(
    private readonly configService: ConfigService,
    private readonly billService: BillService,
    private readonly classService: ClassService,
  ) {}

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
      'partnerCode=' + partnerCode,
      'redirectUrl=' + `https://www.youtube.com/watch?v=psZ1g9fMfeo&list=RDAdrOBcLLhJ8&index=24`,
      'requestId=' + requestId,
      'requestType=' + requestType
    ].join('&');

    console.log('Raw signature:', rawSignature);

    const signature = CryptoJS.HmacSHA256(rawSignature, secretKey).toString(CryptoJS.enc.Hex);

    const requestBody = {
      partnerCode: partnerCode,
      requestId: requestId,
      amount: bill.course.price * 1000,
      orderId: billId,
      orderInfo: `Course Payment - Bill #${bill.course.name}`,
      redirectUrl: `https://www.youtube.com/watch?v=psZ1g9fMfeo&list=RDAdrOBcLLhJ8&index=24`,
      ipnUrl: `${deployedLink}/momo-payment/callback`,
      extraData: extraData,
      requestType: requestType,
      signature: signature,
      lang: 'vi',
    };

    console.log('Request body:', requestBody);
    console.log('Momo endpoint:', momoEndpoint);

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
      // Kiểm tra trạng thái thanh toán
      if (response && response.resultCode === 0) {
        console.log('Payment Successful');

        // Giải mã extraData
        const extraData = response.extraData
          ? JSON.parse(Buffer.from(response.extraData, 'base64').toString())
          : null;
        console.log('Extra Data:', extraData);

        if (extraData && extraData[0]) {
          const billData = extraData[0].bill;
          const billRequest = extraData[0];
          const currentAccount = extraData[0].currentAccount;

          if (billData.id) {
            // Update bill status
            await this.billService.updateBillStatus(billData.id, BillStatusEnum.PAID, extraData[0].paymentCode);
            console.log('Bill status updated to PAID');

            // Create classes for the course
            await this.classService.createClassesForCourse(
              billRequest.courseId,
              currentAccount.id,
              billRequest.time_start,
              billRequest.time_end,
              billRequest.day_of_week,
            );
            console.log('Classes created successfully');
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
