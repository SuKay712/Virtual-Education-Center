import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './common/config/database.config.module';
import { AccountModule } from './modules/account/account.module';
@Module({
  imports: [AuthModule, DatabaseModule, AccountModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
