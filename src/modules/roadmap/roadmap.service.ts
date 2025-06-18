import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roadmap } from '../../entities';
import { CreateRoadmapDto } from './dtos/create-roadmap.dto';
import { UpdateRoadmapDto } from './dtos/update-roadmap.dto';

@Injectable()
export class RoadmapService {
  constructor(
    @InjectRepository(Roadmap)
    private readonly roadmapRepo: Repository<Roadmap>,
  ) {}

  async findAll(): Promise<Roadmap[]> {
    return this.roadmapRepo.find({
      relations: {
        courses: {
          lectures: true
        }
      }
    });
  }

  async findOne(id: number): Promise<Roadmap> {
    const roadmap = await this.roadmapRepo.findOne({
      where: { id },
      relations: {
        courses: {
          lectures: true
        }
      }
    });

    if (!roadmap) {
      throw new NotFoundException(`Roadmap with ID ${id} not found`);
    }

    return roadmap;
  }

  async create(createRoadmapDto: CreateRoadmapDto): Promise<Roadmap> {
    const roadmap = this.roadmapRepo.create(createRoadmapDto);
    return this.roadmapRepo.save(roadmap);
  }

  async update(id: number, updateRoadmapDto: UpdateRoadmapDto): Promise<Roadmap> {
    const roadmap = await this.findOne(id);

    Object.assign(roadmap, updateRoadmapDto);
    return this.roadmapRepo.save(roadmap);
  }

  async remove(id: number): Promise<void> {
    const roadmap = await this.findOne(id);
    await this.roadmapRepo.remove(roadmap);
  }
}
