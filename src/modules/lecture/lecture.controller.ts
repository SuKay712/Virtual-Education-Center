import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LectureService } from './lecture.service';
import { CreateLectureDto } from './dtos/create-lecture.dto';
import { UpdateLectureDto } from './dtos/update-lecture.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Role } from '../../common/enums';

@Controller('lecture')
@UseGuards(AuthGuard)
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @Post('/admin')
  @UseGuards(new RoleGuard([Role.Admin]))
  create(@Body() createLectureDto: CreateLectureDto) {
    return this.lectureService.createLecture(createLectureDto);
  }

  @Get('/admin')
  @UseGuards(new RoleGuard([Role.Admin]))
  findAll() {
    return this.lectureService.findAll();
  }

  @Get('/admin/:id')
  @UseGuards(new RoleGuard([Role.Admin]))
  findOne(@Param('id') id: string) {
    return this.lectureService.findOne(+id);
  }

  @Patch('/admin/:id')
  @UseGuards(new RoleGuard([Role.Admin]))
  update(@Param('id') id: string, @Body() updateLectureDto: UpdateLectureDto) {
    return this.lectureService.update(+id, updateLectureDto);
  }

  @Delete('/admin/:id')
  @UseGuards(new RoleGuard([Role.Admin]))
  remove(@Param('id') id: string) {
    return this.lectureService.remove(+id);
  }
}
