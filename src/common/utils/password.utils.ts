import * as bcrypt from 'bcrypt';

export class PasswordUtils {
  private static readonly SALT_ROUNDS = 10;

  // Phương thức để hash password (đồng bộ)
  static hashPassword(plainPassword: string): string {
    const salt = bcrypt.genSaltSync(this.SALT_ROUNDS);
    return bcrypt.hashSync(plainPassword, salt);
  }

  // Phương thức để kiểm tra password (đồng bộ)
  static checkPassword(plainPassword: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }
}
