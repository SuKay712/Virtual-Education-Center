import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, AfterLoad } from 'typeorm';
import { Lecture } from './lecture.entity';
import { format } from 'date-fns';

@Entity('theory')
export class Theory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Lecture, (lecture) => lecture.theories)
  lecture: Lecture;

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
