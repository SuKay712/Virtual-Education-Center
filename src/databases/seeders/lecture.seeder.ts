import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Course, Lecture } from 'src/entities';

const lectureData = require('./lectureData.json');

export default class LectureSeeder implements Seeder {
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  public async run(): Promise<void> {
    const lectureRepo = this.dataSource.getRepository(Lecture);
    const courseRepo = this.dataSource.getRepository(Course);

    // Xử lý dữ liệu lectureData để ánh xạ courseId thành instance của Course
    const lectures = await Promise.all(
      lectureData.map(async (lecture: any) => {
        const course = await courseRepo.findOne({ where: { id: lecture.courseId } });
        if (!course) {
          throw new Error(`Course with id ${lecture.courseId} not found`);
        }
        return {
          ...lecture,
          course, // Gán instance của Course vào trường quan hệ
        };
      })
    );

    // Seed Lectures
    console.log('Seeding Lectures...');
    await lectureRepo.save(lectures);
    console.log('Seed data for lectures created');
  }
}
