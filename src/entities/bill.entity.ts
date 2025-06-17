import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { Course } from './course.entity';
import { BillPaymentMethodEnum } from '../common/enums/bill-payment-method.enum';
import { BillStatusEnum } from '../common/enums/bill-status.enum';

@Entity('bill')
export class Bill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'enum',
    enum: BillPaymentMethodEnum,
    default: BillPaymentMethodEnum.MOMO,
  })
  paymentMethod: BillPaymentMethodEnum;

  @Column({
    type: 'enum',
    enum: BillStatusEnum,
    default: BillStatusEnum.PENDING,
  })
  status: BillStatusEnum;

  @Column({ nullable: true })
  paymentCode: string;

  @Column({ default: false })
  isPaid: boolean;

  @ManyToOne(() => Account, { eager: false })
  @JoinColumn()
  account: Account;

  @ManyToOne(() => Course, { eager: true })
  @JoinColumn()
  course: Course;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
