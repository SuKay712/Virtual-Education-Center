import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { Roadmap } from '../../entities';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Role } from '../../common/enums';
import { CreateRoadmapDto } from './dtos/create-roadmap.dto';
import { UpdateRoadmapDto } from './dtos/update-roadmap.dto';

@Controller('roadmap')
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAll(): Promise<Roadmap[]> {
    return this.roadmapService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Roadmap> {
    return this.roadmapService.findOne(id);
  }

  @Post('admin')
  @UseGuards(AuthGuard, new RoleGuard([Role.Admin]))
  async create(@Body() createRoadmapDto: CreateRoadmapDto): Promise<Roadmap> {
    return this.roadmapService.create(createRoadmapDto);
  }

  @Put('admin/:id')
  @UseGuards(AuthGuard, new RoleGuard([Role.Admin]))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoadmapDto: UpdateRoadmapDto
  ): Promise<Roadmap> {
    return this.roadmapService.update(id, updateRoadmapDto);
  }

  @Delete('admin/:id')
  @UseGuards(AuthGuard, new RoleGuard([Role.Admin]))
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.roadmapService.remove(id);
    return { message: 'Roadmap deleted successfully' };
  }
}
