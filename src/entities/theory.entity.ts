// src/entities/theory.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Lecture } from './lecture.entity';

@Entity()
export class Theory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('longblob')
  content: Buffer;

  @Column()
  name: string;

  @Column({ name: 'mime_type' })
  mimeType: string;

  @ManyToOne(() => Lecture, lecture => lecture.theories)
  lecture: Lecture;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
