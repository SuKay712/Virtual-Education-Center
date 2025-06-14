import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Account,
  Bill,
  Course,
} from '../../entities';
import { BillRequestDto } from './dtos/billRequestDtos';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BillStatusEnum } from '../../common/enums/bill-status.enum';
import { BillPaymentMethodEnum } from '../../common/enums/bill-payment-method.enum';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async createBill(account: Account, billRequest: BillRequestDto): Promise<Bill> {
    const course = await this.courseRepository.findOne({
      where: { id: billRequest.courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const bill = new Bill();
    bill.account = account;
    bill.course = course;
    bill.price = course.price;
    bill.paymentMethod = billRequest.paymentMethod;
    bill.status = BillStatusEnum.PENDING;
    bill.isPaid = false;

    return this.billRepository.save(bill);
  }

  async getBillById(id: number): Promise<Bill> {
    const bill = await this.billRepository.findOne({
      where: { id },
      relations: ['course']
    });

    if (!bill) {
      throw new NotFoundException('Bill not found');
    }

    return bill;
  }

  async getBillsByAccount(accountId: number): Promise<Bill[]> {
    return this.billRepository.find({
      where: { account: { id: accountId } },
      order: { createdAt: 'DESC' },
    });
  }

  async updateBillStatus(id: number, status: BillStatusEnum, paymentCode: string): Promise<Bill> {
    const bill = await this.getBillById(id);
    bill.status = status;
    bill.isPaid = status === BillStatusEnum.PAID;
    bill.paymentCode = paymentCode;
    return this.billRepository.save(bill);
  }

  async getBillsByAccountId(accountId: number): Promise<Bill[]> {
    const bills = await this.billRepository.find({
      where: {
        account: { id: accountId },
      },
      relations: ['course'],
      order: {
        createdAt: 'DESC'
      }
    });

    if (!bills) {
      return [];
    }

    return bills;
  }
}
