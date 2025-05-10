import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDateFormat1746868503469 implements MigrationInterface {
    name = 'UpdateDateFormat1746868503469'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`theory\` CHANGE \`url\` \`content\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`lecture\` ADD \`description\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`lecture\` ADD \`video_url\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`theory\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`theory\` ADD \`content\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`theory\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`theory\` ADD \`content\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`lecture\` DROP COLUMN \`video_url\``);
        await queryRunner.query(`ALTER TABLE \`lecture\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`theory\` CHANGE \`content\` \`url\` varchar(255) NOT NULL`);
    }

}
