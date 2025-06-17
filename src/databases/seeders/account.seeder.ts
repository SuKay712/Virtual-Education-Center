import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Account } from 'src/entities';
import { Role, Gender } from '../../common/enums';
import { PasswordUtils } from '../../common/utils';

const accountData = require('./accountData.json');

export default class AccountSeeder implements Seeder {
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  public async run(): Promise<void> {
    const accountRepo = this.dataSource.getRepository(Account);
    const hashedPassword = PasswordUtils.hashPassword('password123');

    // Kết hợp tất cả accounts từ JSON
    const allAccounts = [
      ...accountData.accounts,
      ...accountData.studentAccounts
    ];

    // Xử lý dữ liệu để chuyển đổi enum và hash password
    const processedAccounts = allAccounts.map(account => ({
      ...account,
      password: hashedPassword,
      gender: account.gender as Gender,
      role: account.role as Role,
      birthday: new Date(account.birthday),
    }));

    console.log('Seeding Accounts...');
    await accountRepo.save(processedAccounts);
    console.log(`Seed data for ${processedAccounts.length} accounts created`);
  }
}
