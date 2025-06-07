import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, Course } from '../../entities';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Account]), AccountModule],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
