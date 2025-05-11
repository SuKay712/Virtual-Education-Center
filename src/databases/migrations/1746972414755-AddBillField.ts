import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBillField1746972414755 implements MigrationInterface {
    name = 'AddBillField1746972414755'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bill\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`bill\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`bill\` ADD \`price\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`bill\` ADD \`paymentMethod\` enum ('CASH', 'ZALOPAY', 'MOMO') NOT NULL DEFAULT 'CASH'`);
        await queryRunner.query(`ALTER TABLE \`bill\` ADD \`status\` enum ('PENDING', 'PAID', 'CANCELLED', 'FAILED') NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE \`bill\` ADD \`paymentCode\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`bill\` ADD \`isPaid\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`bill\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`bill\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bill\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`bill\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`bill\` DROP COLUMN \`isPaid\``);
        await queryRunner.query(`ALTER TABLE \`bill\` DROP COLUMN \`paymentCode\``);
        await queryRunner.query(`ALTER TABLE \`bill\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`bill\` DROP COLUMN \`paymentMethod\``);
        await queryRunner.query(`ALTER TABLE \`bill\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`bill\` ADD \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`bill\` ADD \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
    }

}
