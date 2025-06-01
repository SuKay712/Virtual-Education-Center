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
import { CourseService } from './course.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Role } from '../../common/enums';

@Controller('course')
@UseGuards(AuthGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post('/admin')
  @UseGuards(new RoleGuard([Role.Admin]))
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.createCourse(createCourseDto);
  }

  @Get('/admin')
  @UseGuards(new RoleGuard([Role.Admin]))
  findAll() {
    return this.courseService.findAll();
  }

  @Get('/admin/:id')
  @UseGuards(new RoleGuard([Role.Admin]))
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(+id);
  }

  @Patch('/admin/:id')
  @UseGuards(new RoleGuard([Role.Admin]))
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(+id, updateCourseDto);
  }

  @Delete('/admin/:id')
  @UseGuards(new RoleGuard([Role.Admin]))
  remove(@Param('id') id: string) {
    return this.courseService.remove(+id);
  }
}
