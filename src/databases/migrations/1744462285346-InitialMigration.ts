import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1744462285346 implements MigrationInterface {
    name = 'InitialMigration1744462285346'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`account\` DROP COLUMN \`isActived\``);
        await queryRunner.query(`ALTER TABLE \`account\` ADD \`isActived\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`account\` DROP COLUMN \`isActived\``);
        await queryRunner.query(`ALTER TABLE \`account\` ADD \`isActived\` varchar(45) NULL DEFAULT '0'`);
    }

}
