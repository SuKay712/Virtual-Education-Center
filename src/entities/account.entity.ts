import { Role, Gender } from '../common';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, AfterLoad } from 'typeorm';
import { Chat } from './chat.entity';
import { Bill } from './bill.entity';
import { Notification } from './notification.entity';
import { Booking } from './booking.entity';
import { Class } from './class.entity';
import { format } from 'date-fns';

@Entity('account')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ nullable: true })
  birthday: Date;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  address: string;

  @Column({ default: false })
  isActived: boolean;

  @Column({ type: 'enum', enum: Role, default: Role.Student })
  role: Role;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => Class, (classEntity) => classEntity.student)
  classes: Class[];

  @OneToMany(() => Booking, (booking) => booking.teacher)
  bookingsAsTeacher: Booking[];

  @OneToMany(() => Chat, (chat) => chat.sender)
  sentChats: Chat[];

  @OneToMany(() => Chat, (chat) => chat.receiver)
  receivedChats: Chat[];

  @OneToMany(() => Bill, (bill) => bill.account)
  bills: Bill[];

  @OneToMany(() => Notification, (notification) => notification.account)
  notifications: Notification[];

  @AfterLoad()
  transformDates() {
    if (this.created_at) {
      this.created_at = format(new Date(this.created_at), 'HH:mm dd/MM/yyyy') as any;
    }
    if (this.updated_at) {
      this.updated_at = format(new Date(this.updated_at), 'HH:mm dd/MM/yyyy') as any;
    }
  }
}
