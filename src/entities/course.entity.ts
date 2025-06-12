import { Entity, PrimaryGeneratedColumn, Column, OneToMany, AfterLoad, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Lecture } from './lecture.entity';
import { Bill } from './bill.entity';
import { format } from 'date-fns';
import { Roadmap } from './roadmap.entity';

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

  @Column({ nullable: true })
  roadmap_id: number;

  @ManyToOne(() => Roadmap, roadmap => roadmap.courses)
  roadmap: Roadmap;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Lecture, (lecture) => lecture.course)
  lectures: Lecture[];

  @OneToMany(() => Bill, (bill) => bill.course)
  bills: Bill[];

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
