import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoadmapAndContact1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Tạo bảng roadmaps
    await queryRunner.query(`
      CREATE TABLE roadmaps (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      )
    `);

    // Tạo bảng contacts
    await queryRunner.query(`
      CREATE TABLE contacts (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL,
        status INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      )
    `);

    // Thêm cột roadmap_id vào bảng courses
    await queryRunner.query(`
      ALTER TABLE course
      ADD COLUMN roadmap_id INT,
      ADD CONSTRAINT fk_course_roadmap
      FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Xóa cột roadmap_id từ bảng courses
    await queryRunner.query(`
      ALTER TABLE course
      DROP FOREIGN KEY fk_course_roadmap,
      DROP COLUMN roadmap_id
    `);

    // Xóa bảng contacts
    await queryRunner.query(`DROP TABLE contacts`);

    // Xóa bảng roadmaps
    await queryRunner.query(`DROP TABLE roadmaps`);
  }
}
