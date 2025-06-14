import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Account } from 'src/entities';
import { Role, Gender } from '../../common/enums';
import { PasswordUtils } from '../../common/utils';

export default class AccountSeeder implements Seeder {
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  public async run(): Promise<void> {
    const accountRepo = this.dataSource.getRepository(Account);

    const accounts = [
      {
        email: 'admin@example.com',
        password: PasswordUtils.hashPassword('admin123'),
        name: 'Admin User',
        gender: Gender.Male,
        birthday: new Date('1990-01-01'),
        phone: '0123456789',
        avatar: '',
        address: 'Hanoi',
        isActived: true,
        role: Role.Admin,
      },
      {
        email: 'teacher@example.com',
        password: PasswordUtils.hashPassword('teacher123'),
        name: 'Teacher User',
        gender: Gender.Female,
        birthday: new Date('1985-05-15'),
        phone: '0987654321',
        avatar: '',
        address: 'HCM',
        isActived: true,
        role: Role.Teacher,
      },
      {
        email: 'student@example.com',
        password: PasswordUtils.hashPassword('student123'),
        name: 'Student User',
        gender: Gender.Other,
        birthday: new Date('2000-09-09'),
        phone: '0111222333',
        avatar: '',
        address: 'Danang',
        isActived: true,
        role: Role.Student,
      },
    ];

    console.log('Seeding Accounts...');
    await accountRepo.save(accounts);
    console.log('Seed data for accounts created');
  }
}
