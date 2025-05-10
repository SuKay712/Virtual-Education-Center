import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBookingTable1746866955856 implements MigrationInterface {
    name = 'CreateBookingTable1746866955856'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`booking\` CHANGE \`payment\` \`payment\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`booking\` CHANGE \`payment\` \`payment\` tinyint NOT NULL`);
    }

}
