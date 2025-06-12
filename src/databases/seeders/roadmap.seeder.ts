import { DataSource } from 'typeorm';
import { Roadmap } from '../../entities/roadmap.entity';
const roadmapData = require('./roadmapData.json');

export default class RoadmapSeeder {
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  public async run(): Promise<void> {
    const roadmapRepository = this.dataSource.getRepository(Roadmap);

    for (const roadmap of roadmapData.roadmaps) {
      const existingRoadmap = await roadmapRepository.findOne({
        where: { name: roadmap.name },
      });

      if (!existingRoadmap) {
        const newRoadmap = roadmapRepository.create(roadmap);
        await roadmapRepository.save(newRoadmap);
        console.log(`Created roadmap: ${roadmap.name}`);
      } else {
        console.log(`Roadmap already exists: ${roadmap.name}`);
      }
    }
  }
}
