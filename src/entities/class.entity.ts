import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Lecture } from './lecture.entity';
import { Account } from './account.entity';

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Lecture, (lecture) => lecture.classes)
  lecture: Lecture;

  @ManyToOne(() => Account, (account) => account.classesAsStudent)
  student: Account;

  @ManyToOne(() => Account, (account) => account.classesAsTeacher)
  teacher: Account;

  @Column({ type: 'datetime', nullable: true })
  time_start: Date;

  @Column({ type: 'datetime', nullable: true })
  time_end: Date;

  @Column({ type: 'int', nullable: true })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'int', nullable: true })
  meeting_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
