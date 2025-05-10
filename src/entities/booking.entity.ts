import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, AfterLoad } from 'typeorm';
import { Class } from './class.entity';
import { Account } from './account.entity';
import { format } from 'date-fns';

@Entity('booking')
export class  Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Class, (classEntity) => classEntity.bookings)
  classEntity: Class;

  @ManyToOne(() => Account, (account) => account.bookingsAsTeacher)
  teacher: Account;

  @Column()
  status: number;

  @Column({ default: false })
  payment: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Transform dates to formatted strings
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
