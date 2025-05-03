import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from '../account/account.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/loginDtio';
// import { CustomMailerService } from '../mailer/mailer.service';
import { RegisterDto } from './dtos/registerDto';
import { PasswordUtils } from '../../common';
import * as dotenv from 'dotenv';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../../entities';
import { Not, Repository } from 'typeorm';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    private accountService: AccountService,
    private jwtService: JwtService,
    // private readonly customMailerService: CustomMailerService
  ) {}

  async login(requestBody: LoginDto) {
    //check email exist
    const accountByEmail = await this.accountService.findByEmail(
      requestBody.email
    );
    if (!accountByEmail) {
      throw new NotFoundException('Account not found!');
    }

    //check password
    // const isMatchPassword = await bcrypt.compare(
    //   requestBody.password,
    //   accountByEmail.password
    // );
    const isMatchPassword = requestBody.password === accountByEmail.password;
    if (!isMatchPassword) {
      throw new BadRequestException('Incorrect password!');
    }

    // check active
    if (!accountByEmail.isActived) {
      throw new BadRequestException('Account is inactive!');
    }
    //generate jwt token
    const payload = {
      id: accountByEmail.id,
      name: accountByEmail.name,
      email: accountByEmail.email,
      role: accountByEmail.role,
    };

    const acess_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    return {
      msg: 'User has been login successfully!',
      acess_token,
      name: accountByEmail.name,
      email: accountByEmail.email,
      phone: accountByEmail.phone,
      avatar: accountByEmail.avatar,
      gender: accountByEmail.gender,
      role: accountByEmail.role,
    };
  }

  async registerAccount(accountData: RegisterDto) {
    const accountFound = await this.accountService.findByEmail(
      accountData.email
    );

    if (accountFound) {
      throw new BadRequestException('The email already exists in the system');
    }
    if (accountData.password !== accountData.confirmPassword) {
      throw new BadRequestException('Confirm password invalid');
    }
    accountData.password = PasswordUtils.hashPassword(accountData.password);
    const newAccount = {
      email: accountData.email,
      password: accountData.password,
      name: accountData.name,
      isActived: true, // Đặt trạng thái tài khoản là kích hoạt
    };

    this.accountService.create(newAccount);
    // const newAccount = {
    //   ...accountData,
    //   isActived: true,
    // };

    const verificationToken = await this.jwtService.signAsync(
      { newAccount: newAccount },
      { secret: process.env.JWT_SECRET, expiresIn: '1d' }
    );

    const verificationLink =
      process.env.DEPLOY_SERVICE_LINK +
      `/auth/verify?token=${verificationToken}`;

    // Gửi email xác minh qua MailerService
    // await this.customMailerService.sendVerificationEmail(newAccount.email, verificationLink);

    return { email: accountData.email, verificationLink };
  }
  // async verifyEmail(token: string) {
  //   const payload = await this.jwtService.verifyAsync(token, {
  //     secret: process.env.JWT_SECRET,
  //   });
  //   let user: Account = await this.accountRepo.save(payload.newAccount);
  //   if (!user) {
  //     return new UnauthorizedException('User not found');
  //   }
  //   user.isActived = true;
  //   await this.accountRepo.create(payload.newAccount);
    // // Cập nhật trạng thái xác minh của người dùng
    // user.isVerified = true; // Hoặc trường tương ứng trong mô hình của bạn
    // await this.userService.update(user.id, user); // Cập nhật thông tin người dùng

  //   return user; // Hoặc trả về thông tin cần thiết
  // }

}
