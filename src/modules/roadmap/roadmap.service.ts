import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roadmap } from '../../entities';

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
    return this.roadmapRepo.findOne({
      where: { id },
      relations: {
        courses: {
          lectures: true
        }
      }
    });
  }
}
