import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Lecture } from './lecture.entity';
import { Bill } from './bill.entity';

@Entity('course')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column()
  num_classes: number;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => Lecture, (lecture) => lecture.course)
  lectures: Lecture[];

  @OneToMany(() => Bill, (bill) => bill.course)
  bills: Bill[];
}
