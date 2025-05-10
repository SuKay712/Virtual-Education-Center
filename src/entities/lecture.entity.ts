// filepath: e:\Workspace\Virtual-Education-Center\backend\src\entities\lecture.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, AfterLoad } from 'typeorm';
import { Course } from './course.entity';
import { Account } from './account.entity';
import { Class } from './class.entity';
import { Theory } from './theory.entity';
import { format } from 'date-fns';

@Entity('lecture')
export class Lecture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => Course, (course) => course.lectures)
  course: Course;

  @OneToMany(() => Class, (classEntity) => classEntity.lecture)
  classes: Class[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => Theory, (theory) => theory.lecture)
  theories: Theory[];

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
