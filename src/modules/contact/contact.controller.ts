import { Controller, Get, Post, Body, UseGuards, Patch, Param, Put } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { RoleGuard } from '../../common/guards/role.guard';
import { Role } from '../../common/enums';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @Get()
  @UseGuards(AuthGuard, new RoleGuard([Role.Admin]))
  findAll() {
    return this.contactService.findAll();
  }

  @Put(':id/status')
  @UseGuards(AuthGuard, new RoleGuard([Role.Admin]))
  updateStatus(@Param('id') id: number, @Body('status') status: number) {
    return this.contactService.updateStatus(id, status);
  }
}
