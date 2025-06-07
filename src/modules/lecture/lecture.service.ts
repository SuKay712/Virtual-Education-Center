import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lecture, Course, Theory } from '../../entities';
import { CreateLectureDto } from './dtos/create-lecture.dto';
import { UpdateLectureDto } from './dtos/update-lecture.dto';
import { CloudinaryConfig } from '../../common/config/cloudinary.config';
import { v2 as cloudinary } from 'cloudinary';
import { CreateTheoryDto } from './dtos/create-theory.dto';

interface TheoryResponse {
  id: number;
  name: string;
  mimeType: string;
}

@Injectable()
export class LectureService {
  constructor(
    @InjectRepository(Lecture)
    private readonly lectureRepo: Repository<Lecture>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(Theory)
    private readonly theoryRepo: Repository<Theory>,
    private readonly cloudinaryConfig: CloudinaryConfig
  ) {}

  private async uploadToCloudinary(file: Express.Multer.File): Promise<{ secure_url: string }> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'theories',
          resource_type: 'raw',
          format: 'pdf',
          access_mode: 'public',
          flags: 'attachment',
          transformation: [
            { fetch_format: 'pdf' }
          ]
        },
        (error, result: { secure_url: string }) => {
          if (error) {
            console.error('Cloudinary Upload Error:', error);
            return reject(error);
          }
          console.log('Cloudinary upload result:', result);
          resolve(result);
        }
      ).end(file.buffer);
    });
  }

  private async createTheory(file: Express.Multer.File, lecture: Lecture): Promise<Theory> {
    try {
      console.log('Creating theory for file:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        bufferLength: file.buffer?.length,
        encoding: file.encoding
      });

      // Kiểm tra file type
      if (!file.mimetype || !file.mimetype.startsWith('application/pdf')) {
        throw new Error('Only PDF files are allowed');
      }

      // Lấy số lượng theory hiện tại của lecture
      const theoryCount = await this.theoryRepo.count({
        where: { lecture: { id: lecture.id } }
      });

      // Tạo tên file theo format: {lectureName}_{số thứ tự}
      const fileName = `${lecture.name}_${theoryCount + 1}`;

      // Kiểm tra buffer trước khi lưu
      if (!file.buffer || file.buffer.length === 0) {
        throw new Error('File buffer is empty');
      }

      // Đảm bảo buffer được xử lý đúng cách
      const buffer = Buffer.isBuffer(file.buffer) ? file.buffer : Buffer.from(file.buffer);
      console.log('Buffer details:', {
        isBuffer: Buffer.isBuffer(buffer),
        length: buffer.length,
        firstBytes: buffer.slice(0, 10).toString('hex')
      });

      // Kiểm tra PDF signature
      const pdfSignature = buffer.slice(0, 4).toString('hex');
      if (pdfSignature !== '25504446') { // %PDF in hex
        throw new Error('Invalid PDF file');
      }

      const theoryData = {
        content: buffer,
        name: fileName,
        mimeType: 'application/pdf',
        lecture
      };

      const savedTheory = await this.theoryRepo.save(theoryData);
      console.log('Theory saved to database:', {
        id: savedTheory.id,
        name: savedTheory.name,
        contentLength: savedTheory.content?.length,
        mimeType: savedTheory.mimeType,
        contentFirstBytes: savedTheory.content ? Buffer.from(savedTheory.content).slice(0, 10).toString('hex') : 'no content'
      });

      // Verify saved content
      const verifyTheory = await this.theoryRepo.findOne({
        where: { id: savedTheory.id }
      });
      console.log('Verified saved theory:', {
        id: verifyTheory.id,
        contentLength: verifyTheory.content?.length,
        contentFirstBytes: verifyTheory.content ? Buffer.from(verifyTheory.content).slice(0, 10).toString('hex') : 'no content'
      });

      return savedTheory;
    } catch (error) {
      console.error('Error in createTheory:', error);
      throw error;
    }
  }

  async createLecture(createLectureDto: CreateLectureDto, files?: Express.Multer.File[]): Promise<Lecture> {
    try {
      console.log('Service - Creating lecture with DTO:', createLectureDto);
      console.log('Service - Files received:', files);

      const course = await this.courseRepo.findOne({
        where: { id: createLectureDto.courseId }
      });

      if (!course) {
        throw new NotFoundException('Course not found');
      }

      const lecture = this.lectureRepo.create({
        name: createLectureDto.name,
        description: createLectureDto.description,
        course
      });

      const savedLecture = await this.lectureRepo.save(lecture);
      console.log('Service - Saved lecture:', savedLecture);

      // Create theories if files are provided
      if (files && files.length > 0) {
        console.log('Service - Processing theory files...');
        try {
          const theoryPromises = files.map(file => this.createTheory(file, savedLecture));
          const savedTheories = await Promise.all(theoryPromises);
          console.log('Service - All theories saved:', savedTheories);
        } catch (error) {
          console.error('Service - Error creating theories:', error);
          throw error;
        }
      } else {
        console.log('Service - No files provided for theories');
      }

      return this.findOne(savedLecture.id);
    } catch (error) {
      console.error('Service - Error in createLecture:', error);
      throw error;
    }
  }

  async findAll(): Promise<Lecture[]> {
    return this.lectureRepo.find({
      relations: ['course', 'theories'],
      order: {
        created_at: 'DESC'
      }
    });
  }

  async findOne(id: number): Promise<Lecture> {
    const lecture = await this.lectureRepo.findOne({
      where: { id },
      relations: ['course', 'theories']
    });

    if (!lecture) {
      throw new NotFoundException('Lecture not found');
    }

    // Chỉ trả về name của theory
    lecture.theories = lecture.theories.map(theory => ({
      id: theory.id,
      name: theory.name,
      mimeType: theory.mimeType
    })) as unknown as Theory[];

    return lecture;
  }

  async update(id: number, updateLectureDto: UpdateLectureDto, files?: Express.Multer.File[]): Promise<Lecture> {
    const lecture = await this.findOne(id);

    Object.assign(lecture, {
      name: updateLectureDto.name,
      description: updateLectureDto.description
    });

    const updatedLecture = await this.lectureRepo.save(lecture);

    // Create theories if files are provided
    if (files && files.length > 0) {
      console.log('Service - Processing theory files...');
      try {
        const theoryPromises = files.map(file => this.createTheory(file, updatedLecture));
        const savedTheories = await Promise.all(theoryPromises);
        console.log('Service - All theories saved:', savedTheories);
      } catch (error) {
        console.error('Service - Error creating theories:', error);
        throw error;
      }
    } else {
      console.log('Service - No files provided for theories');
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const lecture = await this.findOne(id);
    await this.lectureRepo.remove(lecture);
  }

  async getTheoryById(id: number): Promise<Theory> {
    const theory = await this.theoryRepo.findOne({
      where: { id }
    });

    if (!theory) {
      throw new NotFoundException('Theory not found');
    }

    return theory;
  }
}
