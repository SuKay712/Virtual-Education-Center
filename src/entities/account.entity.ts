import { RoleEnum } from '../common';

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Class } from './class.entity';
import { Chat } from './chat.entity';
import { Bill } from './bill.entity';
import { Notification } from './notification.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  displayName: string;

  @Column({ nullable: false })
  isActived: boolean;

  @Column({ nullable: true })
  tel: string;

  @Column({ type: 'enum', enum: ['Male', 'Female', 'Other'], nullable: true })
  gender: 'Male' | 'Female' | 'Other';

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.student })
  role: RoleEnum;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  income: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => Class, (classEntity) => classEntity.student)
  classesAsStudent: Class[];

  @OneToMany(() => Class, (classEntity) => classEntity.teacher)
  classesAsTeacher: Class[];

  @OneToMany(() => Chat, (chat) => chat.sender)
  sentChats: Chat[];

  @OneToMany(() => Chat, (chat) => chat.receiver)
  receivedChats: Chat[];

  @OneToMany(() => Bill, (bill) => bill.account)
  bills: Bill[];

  @OneToMany(() => Notification, (notification) => notification.account)
  notifications: Notification[];
}
