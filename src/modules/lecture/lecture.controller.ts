import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  NotFoundException,
  Res,
  Put,
} from '@nestjs/common';
import { LectureService } from './lecture.service';
import { CreateLectureDto } from './dtos/create-lecture.dto';
import { UpdateLectureDto } from './dtos/update-lecture.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Role } from '../../common/enums';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryConfig } from '../../common/config/cloudinary.config';
import { Response } from 'express';

@Controller('lecture')
@UseGuards(AuthGuard)
export class LectureController {
  constructor(
    private readonly lectureService: LectureService,
    private readonly cloudinaryConfig: CloudinaryConfig
  ) {}

  @Post('/admin')
  @UseGuards(new RoleGuard([Role.Admin]))
  @UseInterceptors(FilesInterceptor('theories', 10, {
    fileFilter: (req, file, callback) => {
      console.log('File received:', file);
      callback(null, true);
    }
  }))
  async create(
    @Body() createLectureDto: CreateLectureDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.lectureService.createLecture(createLectureDto, files);
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


  @Put('/admin/:id')
  @UseGuards(new RoleGuard([Role.Admin]))
  @UseInterceptors(FilesInterceptor('theories', 10, {
    fileFilter: (req, file, callback) => {
      console.log('File received:', file);
      callback(null, true);
    }
  }))
  async update(
    @Param('id') id: string,
    @Body() updateLectureDto: UpdateLectureDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.lectureService.update(+id, updateLectureDto, files);
  }

  @Delete('/admin/:id')
  @UseGuards(new RoleGuard([Role.Admin]))
  remove(@Param('id') id: string) {
    return this.lectureService.remove(+id);
  }
}
