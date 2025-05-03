import { Role, Gender } from '../common';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Chat } from './chat.entity';
import { Bill } from './bill.entity';
import { Notification } from './notification.entity';
import { Lecture } from './lecture.entity';
import { Booking } from './booking.entity';

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
  birthday: string;

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

  // Relationships
  @OneToMany(() => Lecture, (lecture) => lecture.student)
  lectures: Lecture[];

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
}
