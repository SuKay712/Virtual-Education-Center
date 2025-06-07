import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lecture, Course, Theory } from '../../entities';
import { LectureController } from './lecture.controller';
import { LectureService } from './lecture.service';
import { CloudinaryConfig } from '../../common/config/cloudinary.config';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lecture, Course, Theory]), AccountModule],
  controllers: [LectureController],
  providers: [LectureService, CloudinaryConfig],
  exports: [LectureService],
})
export class LectureModule {}
