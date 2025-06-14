import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameFreeTimeTableAndChangeCourseDescription1749799312969 implements MigrationInterface {
    name = 'RenameFreeTimeTableAndChangeCourseDescription1749799312969'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`RENAME TABLE \`freeTimes\` TO \`free_time\``);
        await queryRunner.query(`ALTER TABLE \`course\` MODIFY \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`lecture\` DROP COLUMN \`video_url\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`lecture\` ADD \`video_url\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`course\` MODIFY \`description\` varchar(255) NULL`);
        await queryRunner.query(`RENAME TABLE \`free_time\` TO \`freeTimes\``);
    }
}
