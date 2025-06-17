import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Bill, Account, Course, Class, Lecture } from 'src/entities';
import { BillPaymentMethodEnum } from '../../common/enums/bill-payment-method.enum';
import { BillStatusEnum } from '../../common/enums/bill-status.enum';

const billData = require('./billData.json');

export default class BillSeeder implements Seeder {
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  public async run(): Promise<void> {
    const billRepo = this.dataSource.getRepository(Bill);
    const accountRepo = this.dataSource.getRepository(Account);
    const courseRepo = this.dataSource.getRepository(Course);
    const classRepo = this.dataSource.getRepository(Class);
    const lectureRepo = this.dataSource.getRepository(Lecture);

    console.log('Seeding Bills...');

    for (const billObj of billData.bills) {
      // Tìm student và course
      const student = await accountRepo.findOne({
        where: { email: billObj.studentEmail }
      });
      const course = await courseRepo.findOne({
        where: { id: billObj.courseId }
      });

      if (!student) {
        throw new Error(`Student with email ${billObj.studentEmail} not found`);
      }
      if (!course) {
        throw new Error(`Course with id ${billObj.courseId} not found`);
      }

      // Tạo bill
      const bill = billRepo.create({
        price: billObj.price,
        paymentMethod: billObj.paymentMethod as BillPaymentMethodEnum,
        status: billObj.status as BillStatusEnum,
        paymentCode: billObj.paymentCode,
        isPaid: billObj.isPaid,
        account: student,
        course: course,
        createdAt: new Date(billObj.createdAt),
      });

      const savedBill = await billRepo.save(bill);
      console.log(`Created bill: ${savedBill.id} for student: ${student.name}`);
    }

    console.log('Bill seeding completed');
  }
}
