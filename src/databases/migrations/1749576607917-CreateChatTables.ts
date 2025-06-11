import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateChatTables1749576607917 implements MigrationInterface {
    name = 'CreateChatTables1749576607917'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`chat_group\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`chat_group_members\` (\`chat_group_id\` int NOT NULL, \`account_id\` int NOT NULL, INDEX \`IDX_5da9eef4573c243cccb1c36b2d\` (\`chat_group_id\`), INDEX \`IDX_84148853433ad7183a91d127eb\` (\`account_id\`), PRIMARY KEY (\`chat_group_id\`, \`account_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`chatbox\` ADD \`studentId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`chatbox\` ADD \`chatGroupId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`theory\` CHANGE \`content\` \`content\` longblob NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`theory\` CHANGE \`mime_type\` \`mime_type\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`chatbox\` ADD \`adminId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`chatbox\` ADD CONSTRAINT \`FK_30645c5a4897e5e694a1912b147\` FOREIGN KEY (\`studentId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chatbox\` ADD CONSTRAINT \`FK_067d47b06b24bf85fa93d5a0e18\` FOREIGN KEY (\`chatGroupId\`) REFERENCES \`chat_group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`theory\` ADD CONSTRAINT \`FK_5be55802cfc68cd0d9a2621972a\` FOREIGN KEY (\`lectureId\`) REFERENCES \`lecture\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`freeTimes\` ADD CONSTRAINT \`FK_ed0d0c15874a434e5f2d8d5cda6\` FOREIGN KEY (\`teacherId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chat_group_members\` ADD CONSTRAINT \`FK_5da9eef4573c243cccb1c36b2de\` FOREIGN KEY (\`chat_group_id\`) REFERENCES \`chat_group\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`chat_group_members\` ADD CONSTRAINT \`FK_84148853433ad7183a91d127eb4\` FOREIGN KEY (\`account_id\`) REFERENCES \`account\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`chatbox\` ADD CONSTRAINT \`FK_admin_account\` FOREIGN KEY (\`adminId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chat_group_members\` DROP FOREIGN KEY \`FK_84148853433ad7183a91d127eb4\``);
        await queryRunner.query(`ALTER TABLE \`chat_group_members\` DROP FOREIGN KEY \`FK_5da9eef4573c243cccb1c36b2de\``);
        await queryRunner.query(`ALTER TABLE \`freeTimes\` DROP FOREIGN KEY \`FK_ed0d0c15874a434e5f2d8d5cda6\``);
        await queryRunner.query(`ALTER TABLE \`theory\` DROP FOREIGN KEY \`FK_5be55802cfc68cd0d9a2621972a\``);
        await queryRunner.query(`ALTER TABLE \`chatbox\` DROP FOREIGN KEY \`FK_067d47b06b24bf85fa93d5a0e18\``);
        await queryRunner.query(`ALTER TABLE \`chatbox\` DROP FOREIGN KEY \`FK_30645c5a4897e5e694a1912b147\``);
        await queryRunner.query(`ALTER TABLE \`chatbox\` DROP FOREIGN KEY \`FK_admin_account\``);
        await queryRunner.query(`ALTER TABLE \`chatbox\` DROP COLUMN \`adminId\``);
        await queryRunner.query(`ALTER TABLE \`theory\` CHANGE \`mime_type\` \`mime_type\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`theory\` CHANGE \`content\` \`content\` longblob NULL`);
        await queryRunner.query(`ALTER TABLE \`chatbox\` DROP COLUMN \`chatGroupId\``);
        await queryRunner.query(`ALTER TABLE \`chatbox\` DROP COLUMN \`studentId\``);
        await queryRunner.query(`DROP INDEX \`IDX_84148853433ad7183a91d127eb\` ON \`chat_group_members\``);
        await queryRunner.query(`DROP INDEX \`IDX_5da9eef4573c243cccb1c36b2d\` ON \`chat_group_members\``);
        await queryRunner.query(`DROP TABLE \`chat_group_members\``);
        await queryRunner.query(`DROP TABLE \`chat_group\``);
    }

}
