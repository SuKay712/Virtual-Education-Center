import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveMeetingTableAndAddMeetingUrlToClass1749853372516 implements MigrationInterface {
    name = 'RemoveMeetingTableAndAddMeetingUrlToClass1749853372516'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`class\` ADD \`meeting_url\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`class\` DROP COLUMN \`meeting_url\``);
    }

}
