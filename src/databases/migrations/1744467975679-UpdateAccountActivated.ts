import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAccountActivated1744467975679 implements MigrationInterface {
    name = 'UpdateAccountActivated1744467975679'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`account\` ADD \`isActived\` tinyint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`account\` DROP COLUMN \`isActived\``);
    }

}
