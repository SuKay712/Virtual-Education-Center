import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Booking, Class, Account } from 'src/entities';

const bookingData = require('./bookingData.json');

export default class BookingSeeder implements Seeder {
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  public async run(): Promise<void> {
    const classRepo = this.dataSource.getRepository(Class);
    const teacherRepo = this.dataSource.getRepository(Account);
    const bookingRepo = this.dataSource.getRepository(Booking);

    // Process bookingData to map class_id and teacher_id to their respective instances
    const bookings = await Promise.all(
      bookingData.bookings.map(async (bookingObj: any) => {
        const classInstance = await classRepo.findOne({ where: { id: bookingObj.classId } });
        const teacher = await teacherRepo.findOne({ where: { id: bookingObj.teacherId } });

        if (!classInstance) {
          throw new Error(`Class with id ${bookingObj.class_id} not found`);
        }

        if (!teacher) {
          throw new Error(`Teacher with id ${bookingObj.teacher_id} not found`);
        }

        return {
          classEntity: classInstance,
          teacher,
          status: bookingObj.status,
        };
      })
    );

    // Seed Bookings
    console.log('Seeding Bookings...');
    await bookingRepo.save(bookings);
    console.log('Seed data for bookings created');
  }
}
