// src/seeds/index.ts
import { DataSource } from 'typeorm';
import CourseSeeder from './course.seeder';
import * as entities from '../../entities';
import * as dotenv from 'dotenv';
import BookingSeeder from './booking.seeder';
import RoadmapSeeder from './roadmap.seeder';
import AccountSeeder from './account.seeder';
import LectureSeeder from './lecture.seeder';
import ClassSeeder from './class.seeder';
import BillSeeder from './bill.seeder';

dotenv.config();

async function runSeeders() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: Object.values(entities),
  });

  await dataSource.initialize();

  const seeders = [
    // new AccountSeeder(dataSource),
    // new RoadmapSeeder(dataSource),
    // new CourseSeeder(dataSource),
    // new LectureSeeder(dataSource),
    // new BillSeeder(dataSource),
    // new ClassSeeder(dataSource),
    new BookingSeeder(dataSource),
  ];

  for (const seeder of seeders) {
    await seeder.run();
  }

  // Đóng kết nối
  await dataSource.destroy();
  console.log('All seeders completed');
}

runSeeders().catch(error => console.error(error));
