import { Entity, PrimaryGeneratedColumn, Column, OneToMany, AfterLoad } from 'typeorm';
import { Class } from './class.entity';
import { format } from 'date-fns';

@Entity('meeting')
export class Meeting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  chatbox_id: number;

  @Column()
  meeting_url: string;

  @OneToMany(() => Class, (classEntity) => classEntity.meeting)
  classes: Class[];

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
