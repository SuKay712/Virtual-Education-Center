import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, Roadmap } from '../../entities';
import { RoadmapService } from './roadmap.service';
import { RoadmapController } from './roadmap.controller';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [TypeOrmModule.forFeature([Roadmap, Account]), AccountModule],
  providers: [RoadmapService],
  controllers: [RoadmapController],
  exports: [RoadmapService],
})
export class RoadmapModule {}
