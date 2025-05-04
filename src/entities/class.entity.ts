import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Lecture } from './lecture.entity';
import { Booking } from './booking.entity';
import { Meeting } from './meeting.entity';
import { Account } from './account.entity';

@Entity('class')
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Lecture, (lecture) => lecture.classes)
  lecture: Lecture;

  @ManyToOne(() => Account, (account) => account.classes)
  student: Account;

  @Column({ type: 'datetime' })
  time_start: Date;

  @Column({ type: 'datetime' })
  time_end: Date;

  @Column({ nullable: true })
  rating: number;

  @Column({ nullable: true })
  comment: string;

  @ManyToOne(() => Meeting, (meeting) => meeting.classes)
  meeting: Meeting;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => Booking, (booking) => booking.classEntity)
  bookings: Booking[];
}
