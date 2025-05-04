import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateClassField1746372410885 implements MigrationInterface {
    name = 'UpdateClassField1746372410885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`chatbox\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` text NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`chat\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` text NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`chatboxId\` int NULL, \`senderId\` int NULL, \`receiverId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`booking\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` int NOT NULL, \`payment\` tinyint NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`classEntityId\` int NULL, \`teacherId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`meeting\` (\`id\` int NOT NULL AUTO_INCREMENT, \`chatbox_id\` int NOT NULL, \`meeting_url\` varchar(255) NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_2681b061ca3efab754cd7805e2\` (\`chatbox_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`class\` (\`id\` int NOT NULL AUTO_INCREMENT, \`time_start\` datetime NOT NULL, \`time_end\` datetime NOT NULL, \`rating\` int NULL, \`comment\` varchar(255) NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`lectureId\` int NULL, \`studentId\` int NULL, \`meetingId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`theory\` (\`id\` int NOT NULL AUTO_INCREMENT, \`url\` varchar(255) NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`lectureId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`lecture\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`courseId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`course\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`price\` decimal NOT NULL, \`num_classes\` int NOT NULL, \`description\` varchar(255) NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`bill\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`accountId\` int NULL, \`courseId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notification\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` varchar(255) NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`accountId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`account\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`name\` varchar(255) NULL, \`gender\` enum ('Male', 'Female', 'Other') NULL, \`birthday\` datetime NULL, \`phone\` varchar(255) NULL, \`avatar\` varchar(255) NULL, \`address\` varchar(255) NULL, \`isActived\` tinyint NOT NULL DEFAULT 0, \`role\` enum ('Student', 'Teacher', 'Staff', 'Admin') NOT NULL DEFAULT 'Student', \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_4c8f96ccf523e9a3faefd5bdd4\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`chat\` ADD CONSTRAINT \`FK_e80898653d773b4fc54bbdd3836\` FOREIGN KEY (\`chatboxId\`) REFERENCES \`chatbox\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chat\` ADD CONSTRAINT \`FK_c2b21d8086193c56faafaf1b97c\` FOREIGN KEY (\`senderId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chat\` ADD CONSTRAINT \`FK_580acbf39bdd5ec33812685e22b\` FOREIGN KEY (\`receiverId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`booking\` ADD CONSTRAINT \`FK_4b8f1987d000342685b92252e8d\` FOREIGN KEY (\`classEntityId\`) REFERENCES \`class\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`booking\` ADD CONSTRAINT \`FK_9f46fa28cd1be174e2ad12bc2a3\` FOREIGN KEY (\`teacherId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`class\` ADD CONSTRAINT \`FK_1eaa5fd208c5025e2a54e9b466d\` FOREIGN KEY (\`lectureId\`) REFERENCES \`lecture\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`class\` ADD CONSTRAINT \`FK_ed2fb29a178bf95ff40b2b43ee8\` FOREIGN KEY (\`studentId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`class\` ADD CONSTRAINT \`FK_bebc5a2421317a87e676654d339\` FOREIGN KEY (\`meetingId\`) REFERENCES \`meeting\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`theory\` ADD CONSTRAINT \`FK_5be55802cfc68cd0d9a2621972a\` FOREIGN KEY (\`lectureId\`) REFERENCES \`lecture\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`lecture\` ADD CONSTRAINT \`FK_89e61e55d5b02ea76363a3a55a6\` FOREIGN KEY (\`courseId\`) REFERENCES \`course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bill\` ADD CONSTRAINT \`FK_1f9f865e841e7879e4f2359988d\` FOREIGN KEY (\`accountId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bill\` ADD CONSTRAINT \`FK_9fad0fad5ea338f4f8726bcd58f\` FOREIGN KEY (\`courseId\`) REFERENCES \`course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_00abcf7b2089a5c05f0aedc5676\` FOREIGN KEY (\`accountId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_00abcf7b2089a5c05f0aedc5676\``);
        await queryRunner.query(`ALTER TABLE \`bill\` DROP FOREIGN KEY \`FK_9fad0fad5ea338f4f8726bcd58f\``);
        await queryRunner.query(`ALTER TABLE \`bill\` DROP FOREIGN KEY \`FK_1f9f865e841e7879e4f2359988d\``);
        await queryRunner.query(`ALTER TABLE \`lecture\` DROP FOREIGN KEY \`FK_89e61e55d5b02ea76363a3a55a6\``);
        await queryRunner.query(`ALTER TABLE \`theory\` DROP FOREIGN KEY \`FK_5be55802cfc68cd0d9a2621972a\``);
        await queryRunner.query(`ALTER TABLE \`class\` DROP FOREIGN KEY \`FK_bebc5a2421317a87e676654d339\``);
        await queryRunner.query(`ALTER TABLE \`class\` DROP FOREIGN KEY \`FK_ed2fb29a178bf95ff40b2b43ee8\``);
        await queryRunner.query(`ALTER TABLE \`class\` DROP FOREIGN KEY \`FK_1eaa5fd208c5025e2a54e9b466d\``);
        await queryRunner.query(`ALTER TABLE \`booking\` DROP FOREIGN KEY \`FK_9f46fa28cd1be174e2ad12bc2a3\``);
        await queryRunner.query(`ALTER TABLE \`booking\` DROP FOREIGN KEY \`FK_4b8f1987d000342685b92252e8d\``);
        await queryRunner.query(`ALTER TABLE \`chat\` DROP FOREIGN KEY \`FK_580acbf39bdd5ec33812685e22b\``);
        await queryRunner.query(`ALTER TABLE \`chat\` DROP FOREIGN KEY \`FK_c2b21d8086193c56faafaf1b97c\``);
        await queryRunner.query(`ALTER TABLE \`chat\` DROP FOREIGN KEY \`FK_e80898653d773b4fc54bbdd3836\``);
        await queryRunner.query(`DROP INDEX \`IDX_4c8f96ccf523e9a3faefd5bdd4\` ON \`account\``);
        await queryRunner.query(`DROP TABLE \`account\``);
        await queryRunner.query(`DROP TABLE \`notification\``);
        await queryRunner.query(`DROP TABLE \`bill\``);
        await queryRunner.query(`DROP TABLE \`course\``);
        await queryRunner.query(`DROP TABLE \`lecture\``);
        await queryRunner.query(`DROP TABLE \`theory\``);
        await queryRunner.query(`DROP TABLE \`class\``);
        await queryRunner.query(`DROP INDEX \`IDX_2681b061ca3efab754cd7805e2\` ON \`meeting\``);
        await queryRunner.query(`DROP TABLE \`meeting\``);
        await queryRunner.query(`DROP TABLE \`booking\``);
        await queryRunner.query(`DROP TABLE \`chat\``);
        await queryRunner.query(`DROP TABLE \`chatbox\``);
    }

}
