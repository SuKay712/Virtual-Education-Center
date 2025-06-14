import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, AfterLoad } from 'typeorm';
import { Account } from './account.entity';
import { format } from 'date-fns';

@Entity('free_time')
export class FreeTime {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Account, (account) => account.freeTimes)
  teacher: Account;

  @Column({ default: null})
  title: string;

  @Column({ default: null})
  note: string;

  @Column({ type: 'datetime' })
  time_start: Date;

  @Column({ type: 'datetime' })
  time_end: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

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
