import { Controller, Post, Body, Get, Param, UseGuards, Request, Req, Put } from '@nestjs/common';
import { FreeTimeService } from './free-time.service';
import { CreateFreeTimeDto } from './dto/create-free-time.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Role } from '../../common/enums';

@Controller('free-times')
@UseGuards(AuthGuard)
export class FreeTimeController {
  constructor(private readonly freeTimeService: FreeTimeService) {}

  @Post('/create')
  async create(@Body() createFreeTimeDto: CreateFreeTimeDto, @Req() req) {
    const currentAccount = req.currentAccount
    return this.freeTimeService.create(currentAccount.id, createFreeTimeDto);
  }

  @Get('/list')
  async list(@Req() req) {
    const currentAccount = req.currentAccount
    return this.freeTimeService.list(currentAccount.id);
  }

  @Get('/admin')
  @UseGuards(new RoleGuard([Role.Admin]))
  async getAllFreeTimes() {
    return this.freeTimeService.getAllFreeTimes();
  }

  @Put('/:id/update')
  async update(@Param('id') id: number, @Body() createFreeTimeDto: CreateFreeTimeDto, @Req() req) {
    const currentAccount = req.currentAccount
    return this.freeTimeService.update(currentAccount.id, id, createFreeTimeDto);
  }

  // @Get('teacher/:teacherId')
  // async findByTeacher(@Param('teacherId') teacherId: number) {
  //   return this.freeTimeService.findByTeacher(teacherId);
  // }
}
