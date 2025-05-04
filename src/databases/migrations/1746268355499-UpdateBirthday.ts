import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBirthday1746268355499 implements MigrationInterface {
    name = 'UpdateBirthday1746268355499'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`account\` DROP COLUMN \`birthday\``);
        await queryRunner.query(`ALTER TABLE \`account\` ADD \`birthday\` datetime NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`account\` DROP COLUMN \`birthday\``);
        await queryRunner.query(`ALTER TABLE \`account\` ADD \`birthday\` varchar(255) NULL`);
    }

}
