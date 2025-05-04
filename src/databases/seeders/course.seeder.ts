import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Course, Lecture } from 'src/entities';

const courseData = require('./courseData.json');

export default class CourseSeeder implements Seeder {
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  public async run(): Promise<void> {
    const courseRepo = this.dataSource.getRepository(Course);

    // Seed Courses
    console.log('Seeding courses...');
    await courseRepo.save(courseData);
    console.log('Seed data for courses created');
  }
}
