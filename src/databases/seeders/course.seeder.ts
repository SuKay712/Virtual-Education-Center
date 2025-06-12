import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Course, Lecture } from 'src/entities';
import { Roadmap } from '../../entities/roadmap.entity';

const courseData = require('./courseData.json');

export default class CourseSeeder implements Seeder {
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  public async run(): Promise<void> {
    const courseRepo = this.dataSource.getRepository(Course);
    const roadmapRepo = this.dataSource.getRepository(Roadmap);

    const courses = await Promise.all(
      courseData.courses.map(async (courseObj: any) => {
        let roadmap = null;
        if (courseObj.roadmap_id) {
          roadmap = await roadmapRepo.findOne({ where: { id: courseObj.roadmap_id } });
        }

        if (!roadmap) {
          throw new Error('No roadmap found for course: ' + courseObj.name);
        }
        return {
          ...courseObj,
          roadmap,
        };
      })
    );

    console.log('Seeding Courses...');
    await courseRepo.save(courses);
    console.log('Seed data for courses created');
  }
}
