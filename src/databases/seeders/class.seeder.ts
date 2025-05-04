import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Lecture, Class, Account } from 'src/entities';

const classData = require('./classData.json');

export default class ClassSeeder implements Seeder {
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  public async run(): Promise<void> {
    const lectureRepo = this.dataSource.getRepository(Lecture);
    const classRepo = this.dataSource.getRepository(Class);
    const accountRepo = this.dataSource.getRepository(Account);

    // Xử lý dữ liệu classData để ánh xạ courseId thành instance của Course
    const classes = await Promise.all(
      classData.map(async (classObj: any) => {
        const lecture = await lectureRepo.findOne({ where: { id: classObj.lectureId } });
        const student = await accountRepo.findOne({ where: { id: classObj.studentId } });
        if (!lecture) {
          throw new Error(`Lecture with id ${classObj.lectureId} not found`);
        }

        if (!student) {
          throw new Error(`Student with id ${classObj.studentId} not found`);
        }

        return {
          ...classObj,
          student,
          lecture,
        };
      })
    );

    // Seed Lectures
    console.log('Seeding Lectures...');
    await classRepo.save(classes);
    console.log('Seed data for lectures created');
  }
}
