import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountModule } from '../../modules/account/account.module';
import { JwtModule } from '@nestjs/jwt';
// import { CustomMailerModule } from '../mailer/mailer.module';
// import { CustomMailerService } from '../mailer/mailer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../../entities';
@Module({
  imports: [
    AccountModule,
    // CustomMailerModule,
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([Account]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
