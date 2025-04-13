import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAccount1744464773978 implements MigrationInterface {
    name = 'UpdateAccount1744464773978'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`account\` DROP COLUMN \`teacher\``);
        await queryRunner.query(`ALTER TABLE \`account\` DROP COLUMN \`admin\``);
        await queryRunner.query(`ALTER TABLE \`account\` DROP COLUMN \`isActived\``);
        await queryRunner.query(`ALTER TABLE \`account\` ADD \`avatar\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`account\` ADD \`displayName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`account\` ADD \`tel\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`account\` ADD \`role\` enum ('admin', 'student', 'teacher', 'staff') NOT NULL DEFAULT 'student'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`account\` DROP COLUMN \`role\``);
        await queryRunner.query(`ALTER TABLE \`account\` DROP COLUMN \`tel\``);
        await queryRunner.query(`ALTER TABLE \`account\` DROP COLUMN \`displayName\``);
        await queryRunner.query(`ALTER TABLE \`account\` DROP COLUMN \`avatar\``);
        await queryRunner.query(`ALTER TABLE \`account\` ADD \`isActived\` varchar(45) NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`account\` ADD \`admin\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`account\` ADD \`teacher\` tinyint NOT NULL DEFAULT '0'`);
    }

}
