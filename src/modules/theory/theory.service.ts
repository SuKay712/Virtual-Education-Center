import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Theory } from '../../entities';

@Injectable()
export class TheoryService {
  constructor(
    @InjectRepository(Theory)
    private readonly theoryRepo: Repository<Theory>
  ) {}

  async findOne(id: number): Promise<Theory> {
    const theory = await this.theoryRepo.findOne({
      where: { id }
    });

    if (!theory) {
      throw new NotFoundException('Theory not found');
    }

    return theory;
  }

  async remove(id: number): Promise<void> {
    const theory = await this.findOne(id);
    await this.theoryRepo.remove(theory);
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
