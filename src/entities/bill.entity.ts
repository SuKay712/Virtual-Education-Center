import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, AfterLoad } from 'typeorm';
import { Account } from './account.entity';
import { Course } from './course.entity';
import { format } from 'date-fns';

@Entity('bill')
export class Bill {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Account, (account) => account.bills)
  account: Account;

  @ManyToOne(() => Course, (course) => course.bills)
  course: Course;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

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
