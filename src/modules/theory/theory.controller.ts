import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { TheoryService } from './theory.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Role } from '../../common/enums';
import { Response } from 'express';

@Controller('theory')
@UseGuards(AuthGuard)
export class TheoryController {
  constructor(private readonly theoryService: TheoryService) {}

  @Get(':id/download')
  async downloadTheory(@Param('id') id: number, @Res() res: Response) {
    try {
      const theory = await this.theoryService.getTheoryById(id);
      if (!theory) {
        throw new NotFoundException('Theory not found');
      }

      console.log('Downloading theory:', {
        id: theory.id,
        name: theory.name,
        mimeType: theory.mimeType,
        contentLength: theory.content?.length,
        contentFirstBytes: theory.content ? Buffer.from(theory.content).slice(0, 10).toString('hex') : 'no content'
      });

      // Đảm bảo content là Buffer
      let content = theory.content;
      if (!Buffer.isBuffer(content)) {
        console.log('Converting content to Buffer');
        content = Buffer.from(content);
        console.log('Converted content:', {
          isBuffer: Buffer.isBuffer(content),
          length: content.length,
          firstBytes: content.slice(0, 10).toString('hex')
        });
      }

      // Kiểm tra PDF signature
      const pdfSignature = content.slice(0, 4).toString('hex');
      console.log('PDF signature:', pdfSignature);
      if (pdfSignature !== '25504446') { // %PDF in hex
        throw new Error('Invalid PDF content');
      }

      // Set headers
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${theory.name}.pdf"`,
        'Content-Length': content.length,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
      });

      // Gửi buffer trực tiếp
      res.end(content);
    } catch (error) {
      console.error('Error downloading theory:', error);
      throw error;
    }
  }

  @Delete('/admin/:id')
  @UseGuards(new RoleGuard([Role.Admin]))
  async deleteTheory(@Param('id') id: string) {
    return this.theoryService.remove(parseInt(id));
  }
}
