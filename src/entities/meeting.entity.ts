import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Class } from './class.entity';

@Entity('meeting')
export class Meeting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  chatbox_id: number;

  @Column()
  meeting_url: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => Class, (classEntity) => classEntity.meeting)
  classes: Class[];
}
