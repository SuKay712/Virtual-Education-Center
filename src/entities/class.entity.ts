import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, AfterLoad } from 'typeorm';
import { Lecture } from './lecture.entity';
import { Booking } from './booking.entity';
import { Account } from './account.entity';
import { format } from 'date-fns';

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

  @Column({ nullable: true })
  meeting_url: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => Booking, (booking) => booking.classEntity)
  bookings: Booking[];

  // Transform dates to formatted strings
  @AfterLoad()
  transformDates() {
    if (this.time_start) {
      this.time_start = format(new Date(this.time_start), 'HH:mm dd/MM/yyyy') as any;
    }
    if (this.time_end) {
      this.time_end = format(new Date(this.time_end), 'HH:mm dd/MM/yyyy') as any;
    }
    if (this.created_at) {
      this.created_at = format(new Date(this.created_at), 'HH:mm dd/MM/yyyy') as any;
    }
    if (this.updated_at) {
      this.updated_at = format(new Date(this.updated_at), 'HH:mm dd/MM/yyyy') as any;
    }
  }
}
