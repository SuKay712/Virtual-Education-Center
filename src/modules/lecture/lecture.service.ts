import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lecture, Course } from '../../entities';
import { CreateLectureDto } from './dtos/create-lecture.dto';
import { UpdateLectureDto } from './dtos/update-lecture.dto';

@Injectable()
export class LectureService {
  constructor(
    @InjectRepository(Lecture)
    private readonly lectureRepo: Repository<Lecture>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  async createLecture(createLectureDto: CreateLectureDto): Promise<Lecture> {
    const course = await this.courseRepo.findOne({
      where: { id: createLectureDto.courseId }
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const lecture = this.lectureRepo.create({
      ...createLectureDto,
      course
    });

    return this.lectureRepo.save(lecture);
  }

  async findAll(): Promise<Lecture[]> {
    return this.lectureRepo.find({
      relations: ['course', 'theories'],
      order: {
        created_at: 'DESC'
      }
    });
  }

  async findOne(id: number): Promise<Lecture> {
    const lecture = await this.lectureRepo.findOne({
      where: { id },
      relations: ['course', 'theories']
    });

    if (!lecture) {
      throw new NotFoundException('Lecture not found');
    }

    return lecture;
  }

  async update(id: number, updateLectureDto: UpdateLectureDto): Promise<Lecture> {
    const lecture = await this.findOne(id);

    if (updateLectureDto.courseId) {
      const course = await this.courseRepo.findOne({
        where: { id: updateLectureDto.courseId }
      });

      if (!course) {
        throw new NotFoundException('Course not found');
      }

      lecture.course = course;
    }

    Object.assign(lecture, {
      name: updateLectureDto.name,
      description: updateLectureDto.description
    });

    return this.lectureRepo.save(lecture);
  }

  async remove(id: number): Promise<void> {
    const lecture = await this.findOne(id);
    await this.lectureRepo.remove(lecture);
  }
}
