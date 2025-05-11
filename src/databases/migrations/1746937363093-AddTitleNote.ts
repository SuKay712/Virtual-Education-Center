import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTitleNote1746937363093 implements MigrationInterface {
    name = 'AddTitleNote1746937363093'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`freeTimes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NULL, \`note\` varchar(255) NULL, \`time_start\` datetime NOT NULL, \`time_end\` datetime NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`teacherId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`freeTimes\` ADD CONSTRAINT \`FK_ed0d0c15874a434e5f2d8d5cda6\` FOREIGN KEY (\`teacherId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`freeTimes\` DROP FOREIGN KEY \`FK_ed0d0c15874a434e5f2d8d5cda6\``);
        await queryRunner.query(`DROP TABLE \`freeTimes\``);
    }

}
