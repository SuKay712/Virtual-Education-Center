import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  Put,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Role } from '../../common/enums';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get('/public')
  async getPublicCourses() {
    return this.courseService.getPublicCourses();
  }

  @Post('/admin')
  @UseGuards(AuthGuard, new RoleGuard([Role.Admin]))
  async create(@Body() createCourseDto: CreateCourseDto) {
    const course = await this.courseService.createCourse(createCourseDto);
    return {
      message: 'Course created successfully',
      data: course
    };
  }

  @Get('/admin')
  @UseGuards(AuthGuard, new RoleGuard([Role.Admin]))
  findAll() {
    console.log('findAll');
    return this.courseService.findAll();
  }

  @Get('/admin/:id')
  @UseGuards(AuthGuard, new RoleGuard([Role.Admin]))
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(+id);
  }

  @Put('/admin/:id')
  @UseGuards(AuthGuard, new RoleGuard([Role.Admin]))
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(+id, updateCourseDto);
  }

  @Delete('/admin/:id')
  @UseGuards(AuthGuard, new RoleGuard([Role.Admin]))
  remove(@Param('id') id: string) {
    return this.courseService.remove(+id);
  }
}
