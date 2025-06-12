import {
  Controller,
  Get,
  UseGuards,
  Put,
  Body,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Role } from '../../common/enums';
import { UpdateClassDto } from './dtos/update-class.dto';
import { UpdateClassRatingDto } from './dtos/update-class-rating.dto';

@Controller('class')
@UseGuards(AuthGuard)
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get('/admin')
  @UseGuards(new RoleGuard([Role.Admin]))
  async getAllClassesWithBookings() {
    return this.classService.getAllClassesWithBookings();
  }

  @Put('/admin/:id')
  @UseGuards(new RoleGuard([Role.Admin]))
  async updateClass(
    @Param('id') id: number,
    @Body() updateClassDto: UpdateClassDto
  ) {
    return this.classService.updateClass(id, updateClassDto);
  }

  @UseGuards(new RoleGuard([Role.Teacher]))
  @Put(':id/rate')
  async updateClassRating(
    @Param('id') id: number,
    @Request() req,
    @Body() updateDto: UpdateClassRatingDto
  ) {
    return this.classService.updateClassRating(id, req.currentAccount.id, updateDto);
  }
}
