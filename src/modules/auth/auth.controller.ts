import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { LoginDto } from './dtos/loginDtio';
import { AuthService } from './auth.service';
// import { CustomMailerService } from '../mailer/mailer.service';
import { RegisterDto } from './dtos/registerDto';
import { LoggingInterceptor } from '../../common/interceptors';

@Controller('/auth')
@UseInterceptors(LoggingInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    // private customMailerService: CustomMailerService
  ) {}

  @Post('/login')
  loginUser(@Body() requestBody: LoginDto) {
    return this.authService.login(requestBody);
  }

  @Post('/register')
  async registerUser(@Body() registerDto: RegisterDto) {
    const result = await this.authService.registerAccount(registerDto);

    // Gửi email xác minh sau khi đăng ký thành công
    // await this.customMailerService.sendVerificationEmail(
    //   result.email,
    //   result.verificationLink
    // );

    return {
      message: 'Registration successful! Please verify your email.',
      result: result,
    };
  }

  @Post('/reset-password')
  async resetPassword(@Body('email') email: string) {
    // const result = await this.authService.sendPasswordReset(email);

    // // Gửi email reset mật khẩu sau khi yêu cầu
    // await this.customMailerService.sendVerificationPasswordResetEmail(
    //   result.email,
    //   result.resetLink
    // );

    // return {
    //   message: 'Password reset link sent to your email.',
    //   resetLink: result.resetLink,
    // };
  }

  @Get('verify')
  @Redirect()
  async verifyEmail(@Query('token') token: string) {
    // try {
    //   const result = await this.authService.verifyEmail(token);
    //   return {
    //     url: `http://localhost:3000/auth/login?message=${encodeURIComponent(
    //       'Tài khoản đã được kích hoạt'
    //     )}`,
    //   };
    // } catch (error) {
    //   return new Error('Invalid or expired token');
    // }
  }

  @Get('/get-reset-password')
  @Redirect()
  async getResetPassword(@Query('token') token: string) {
    // const result = await this.authService.resetPassword(token);
    // await this.customMailerService.sendPasswordReset(result.emailreset);
    // return {
    //   url: `http://localhost:3000/auth/login?message=${encodeURIComponent(
    //     'Yêu cầu tạo mới mật khẩu đã được gửi. Vui lòng kiểm tra email!'
    //   )}`,
    // };
  }
}
