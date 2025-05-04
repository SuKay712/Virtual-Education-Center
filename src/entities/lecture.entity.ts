// filepath: e:\Workspace\Virtual-Education-Center\backend\src\entities\lecture.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Course } from './course.entity';
import { Account } from './account.entity';
import { Class } from './class.entity';
import { Theory } from './theory.entity';

@Entity('lecture')
export class Lecture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Course, (course) => course.lectures)
  course: Course;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => Class, (classEntity) => classEntity.lecture)
  classes: Class[];

  @OneToMany(() => Theory, (theory) => theory.lecture)
  theories: Theory[];
}
