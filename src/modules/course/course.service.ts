import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course, Roadmap } from '../../entities';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { Lecture } from '../../entities';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(Roadmap)
    private readonly roadmapRepo: Repository<Roadmap>,
  ) {}

  async createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
    // Validate roadmap if provided
    if (createCourseDto.roadmap_id) {
      const roadmap = await this.roadmapRepo.findOne({
        where: { id: createCourseDto.roadmap_id }
      });

      if (!roadmap) {
        throw new BadRequestException('Roadmap not found');
      }
    }

    const course = this.courseRepo.create(createCourseDto);
    const savedCourse = await this.courseRepo.save(course);

    // Return course with roadmap relationship
    return this.findOne(savedCourse.id);
  }

  async findAll(): Promise<Course[]> {
    const courses = await this.courseRepo.find({
      relations: ['lectures.theories', 'roadmap'],
      order: {
        created_at: 'DESC'
      }
    });

    // Chỉ trả về thông tin cần thiết của theory
    return courses.map(course => ({
      ...course,
      lectures: course.lectures.map(lecture => ({
        ...lecture,
        theories: lecture.theories.map(theory => ({
          id: theory.id,
          name: theory.name,
          mimeType: theory.mimeType
        }))
      })) as unknown as Lecture[]
    })) as unknown as Course[];
  }

  async findOne(id: number): Promise<Course> {
    const course = await this.courseRepo.findOne({
      where: { id },
      relations: ['lectures', 'lectures.theories', 'roadmap']
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    course.lectures = course.lectures.map(lecture => ({
      ...lecture,
      theories: lecture.theories.map(theory => ({
        id: theory.id,
        name: theory.name,
        mimeType: theory.mimeType
      }))
    })) as unknown as Lecture[];

    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);

    // Validate roadmap if provided
    if (updateCourseDto.roadmap_id) {
      const roadmap = await this.roadmapRepo.findOne({
        where: { id: updateCourseDto.roadmap_id }
      });

      if (!roadmap) {
        throw new BadRequestException('Roadmap not found');
      }
    }

    Object.assign(course, updateCourseDto);
    return this.courseRepo.save(course);
  }

  async remove(id: number): Promise<void> {
    const course = await this.findOne(id);
    await this.courseRepo.remove(course);
  }

  async getPublicCourses() {
    return this.courseRepo.find({
      select: ['id', 'name', 'description'],
    });
  }
}
