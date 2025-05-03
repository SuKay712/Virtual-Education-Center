import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Lecture } from './lecture.entity';

@Entity('theory')
export class Theory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Lecture, (lecture) => lecture.theories)
  lecture: Lecture;

  @Column()
  url: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
