import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { Roadmap } from '../../entities';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('roadmap')
@UseGuards(AuthGuard)
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  @Get()
  async findAll(): Promise<Roadmap[]> {
    return this.roadmapService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Roadmap> {
    return this.roadmapService.findOne(id);
  }
}
