import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassService } from './class.service';
import { Class, Course, Lecture, Account } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Class, Course, Lecture, Account])],
  providers: [ClassService],
  exports: [ClassService],
})
export class ClassModule {}
