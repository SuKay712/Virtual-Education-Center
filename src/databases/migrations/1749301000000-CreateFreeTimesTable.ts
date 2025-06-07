import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFreeTimesTable1749301000000 implements MigrationInterface {
    name = 'CreateFreeTimesTable1749301000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`freeTimes\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`title\` varchar(255) NULL,
                \`note\` varchar(255) NULL,
                \`time_start\` datetime NOT NULL,
                \`time_end\` datetime NOT NULL,
                \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                \`teacherId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`freeTimes\``);
    }
}
