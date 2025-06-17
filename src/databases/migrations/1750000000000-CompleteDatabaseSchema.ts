import { MigrationInterface, QueryRunner } from "typeorm";

export class CompleteDatabaseSchema1750000000000 implements MigrationInterface {
    name = 'CompleteDatabaseSchema1750000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Create base tables with correct structure matching entities
        await queryRunner.query(`CREATE TABLE \`chatbox\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` text NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`chat\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` text NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`chatboxId\` int NULL, \`senderId\` int NULL, \`receiverId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`booking\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` int NOT NULL, \`payment\` tinyint NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`classEntityId\` int NULL, \`teacherId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`class\` (\`id\` int NOT NULL AUTO_INCREMENT, \`time_start\` datetime NOT NULL, \`time_end\` datetime NOT NULL, \`rating\` int NULL, \`comment\` varchar(255) NULL, \`meeting_url\` varchar(255) NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`lectureId\` int NULL, \`studentId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`lecture\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`courseId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`course\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`price\` decimal NOT NULL, \`num_classes\` int NOT NULL, \`description\` text NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`bill\` (\`id\` int NOT NULL AUTO_INCREMENT, \`price\` decimal(10,2) NOT NULL, \`paymentMethod\` enum('CASH', 'ZALOPAY', 'MOMO') NOT NULL DEFAULT 'MOMO', \`status\` enum('PENDING', 'PAID', 'CANCELLED', 'FAILED') NOT NULL DEFAULT 'PENDING', \`paymentCode\` varchar(255) NULL, \`isPaid\` tinyint NOT NULL DEFAULT 0, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`accountId\` int NULL, \`courseId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notification\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` varchar(255) NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`accountId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`account\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`name\` varchar(255) NULL, \`gender\` enum ('Male', 'Female', 'Other') NULL, \`birthday\` datetime NULL, \`phone\` varchar(255) NULL, \`avatar\` varchar(255) NULL, \`address\` varchar(255) NULL, \`isActived\` tinyint NOT NULL DEFAULT 0, \`role\` enum ('Student', 'Teacher', 'Staff', 'Admin') NOT NULL DEFAULT 'Student', \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_4c8f96ccf523e9a3faefd5bdd4\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);

        // 2. Add foreign key constraints
        await queryRunner.query(`ALTER TABLE \`chat\` ADD CONSTRAINT \`FK_e80898653d773b4fc54bbdd3836\` FOREIGN KEY (\`chatboxId\`) REFERENCES \`chatbox\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chat\` ADD CONSTRAINT \`FK_c2b21d8086193c56faafaf1b97c\` FOREIGN KEY (\`senderId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chat\` ADD CONSTRAINT \`FK_580acbf39bdd5ec33812685e22b\` FOREIGN KEY (\`receiverId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`booking\` ADD CONSTRAINT \`FK_4b8f1987d000342685b92252e8d\` FOREIGN KEY (\`classEntityId\`) REFERENCES \`class\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`booking\` ADD CONSTRAINT \`FK_9f46fa28cd1be174e2ad12bc2a3\` FOREIGN KEY (\`teacherId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`class\` ADD CONSTRAINT \`FK_1eaa5fd208c5025e2a54e9b466d\` FOREIGN KEY (\`lectureId\`) REFERENCES \`lecture\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`class\` ADD CONSTRAINT \`FK_ed2fb29a178bf95ff40b2b43ee8\` FOREIGN KEY (\`studentId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`lecture\` ADD CONSTRAINT \`FK_89e61e55d5b02ea76363a3a55a6\` FOREIGN KEY (\`courseId\`) REFERENCES \`course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bill\` ADD CONSTRAINT \`FK_1f9f865e841e7879e4f2359988d\` FOREIGN KEY (\`accountId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bill\` ADD CONSTRAINT \`FK_9fad0fad5ea338f4f8726bcd58f\` FOREIGN KEY (\`courseId\`) REFERENCES \`course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_00abcf7b2089a5c05f0aedc5676\` FOREIGN KEY (\`accountId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);

        // 3. Update booking table payment field
        await queryRunner.query(`ALTER TABLE \`booking\` CHANGE \`payment\` \`payment\` tinyint NOT NULL DEFAULT 0`);

        // 4. Create theory table
        await queryRunner.query(`
            CREATE TABLE \`theory\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`content\` longblob NOT NULL,
                \`mime_type\` varchar(255) NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`lectureId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);

        // 5. Create free_time table (correct name from entity)
        await queryRunner.query(`
            CREATE TABLE \`free_time\` (
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

        // 6. Create chat tables and add foreign keys
        await queryRunner.query(`CREATE TABLE \`chat_group\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`chat_group_members\` (\`chat_group_id\` int NOT NULL, \`account_id\` int NOT NULL, INDEX \`IDX_5da9eef4573c243cccb1c36b2d\` (\`chat_group_id\`), INDEX \`IDX_84148853433ad7183a91d127eb\` (\`account_id\`), PRIMARY KEY (\`chat_group_id\`, \`account_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`chatbox\` ADD \`studentId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`chatbox\` ADD \`chatGroupId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`chatbox\` ADD \`adminId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`chatbox\` ADD CONSTRAINT \`FK_30645c5a4897e5e694a1912b147\` FOREIGN KEY (\`studentId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chatbox\` ADD CONSTRAINT \`FK_067d47b06b24bf85fa93d5a0e18\` FOREIGN KEY (\`chatGroupId\`) REFERENCES \`chat_group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`theory\` ADD CONSTRAINT \`FK_5be55802cfc68cd0d9a2621972a\` FOREIGN KEY (\`lectureId\`) REFERENCES \`lecture\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`free_time\` ADD CONSTRAINT \`FK_ed0d0c15874a434e5f2d8d5cda6\` FOREIGN KEY (\`teacherId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chat_group_members\` ADD CONSTRAINT \`FK_5da9eef4573c243cccb1c36b2de\` FOREIGN KEY (\`chat_group_id\`) REFERENCES \`chat_group\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`chat_group_members\` ADD CONSTRAINT \`FK_84148853433ad7183a91d127eb4\` FOREIGN KEY (\`account_id\`) REFERENCES \`account\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`chatbox\` ADD CONSTRAINT \`FK_admin_account\` FOREIGN KEY (\`adminId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);

        // 7. Create roadmaps and contacts tables
        await queryRunner.query(`
            CREATE TABLE roadmaps (
                id INT NOT NULL AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            )
        `);
        await queryRunner.query(`
            CREATE TABLE contacts (
                id INT NOT NULL AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                phone_number VARCHAR(20) NOT NULL,
                email VARCHAR(255) NOT NULL,
                status INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            )
        `);
        await queryRunner.query(`
            ALTER TABLE course
            ADD COLUMN roadmap_id INT,
            ADD CONSTRAINT fk_course_roadmap
            FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove roadmaps and contacts
        await queryRunner.query(`ALTER TABLE course DROP FOREIGN KEY fk_course_roadmap, DROP COLUMN roadmap_id`);
        await queryRunner.query(`DROP TABLE contacts`);
        await queryRunner.query(`DROP TABLE roadmaps`);

        // Remove chat tables and foreign keys
        await queryRunner.query(`ALTER TABLE \`chat_group_members\` DROP FOREIGN KEY \`FK_84148853433ad7183a91d127eb4\``);
        await queryRunner.query(`ALTER TABLE \`chat_group_members\` DROP FOREIGN KEY \`FK_5da9eef4573c243cccb1c36b2de\``);
        await queryRunner.query(`ALTER TABLE \`free_time\` DROP FOREIGN KEY \`FK_ed0d0c15874a434e5f2d8d5cda6\``);
        await queryRunner.query(`ALTER TABLE \`theory\` DROP FOREIGN KEY \`FK_5be55802cfc68cd0d9a2621972a\``);
        await queryRunner.query(`ALTER TABLE \`chatbox\` DROP FOREIGN KEY \`FK_067d47b06b24bf85fa93d5a0e18\``);
        await queryRunner.query(`ALTER TABLE \`chatbox\` DROP FOREIGN KEY \`FK_30645c5a4897e5e694a1912b147\``);
        await queryRunner.query(`ALTER TABLE \`chatbox\` DROP FOREIGN KEY \`FK_admin_account\``);
        await queryRunner.query(`ALTER TABLE \`chatbox\` DROP COLUMN \`adminId\``);
        await queryRunner.query(`ALTER TABLE \`chatbox\` DROP COLUMN \`chatGroupId\``);
        await queryRunner.query(`ALTER TABLE \`chatbox\` DROP COLUMN \`studentId\``);
        await queryRunner.query(`DROP INDEX \`IDX_84148853433ad7183a91d127eb\` ON \`chat_group_members\``);
        await queryRunner.query(`DROP INDEX \`IDX_5da9eef4573c243cccb1c36b2d\` ON \`chat_group_members\``);
        await queryRunner.query(`DROP TABLE \`chat_group_members\``);
        await queryRunner.query(`DROP TABLE \`chat_group\``);

        // Drop free_time table
        await queryRunner.query(`DROP TABLE \`free_time\``);

        // Drop theory table
        await queryRunner.query(`DROP TABLE \`theory\``);

        // Reverse booking payment field
        await queryRunner.query(`ALTER TABLE \`booking\` CHANGE \`payment\` \`payment\` tinyint NOT NULL`);

        // Remove all foreign key constraints
        await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_00abcf7b2089a5c05f0aedc5676\``);
        await queryRunner.query(`ALTER TABLE \`bill\` DROP FOREIGN KEY \`FK_9fad0fad5ea338f4f8726bcd58f\``);
        await queryRunner.query(`ALTER TABLE \`bill\` DROP FOREIGN KEY \`FK_1f9f865e841e7879e4f2359988d\``);
        await queryRunner.query(`ALTER TABLE \`lecture\` DROP FOREIGN KEY \`FK_89e61e55d5b02ea76363a3a55a6\``);
        await queryRunner.query(`ALTER TABLE \`class\` DROP FOREIGN KEY \`FK_ed2fb29a178bf95ff40b2b43ee8\``);
        await queryRunner.query(`ALTER TABLE \`class\` DROP FOREIGN KEY \`FK_1eaa5fd208c5025e2a54e9b466d\``);
        await queryRunner.query(`ALTER TABLE \`booking\` DROP FOREIGN KEY \`FK_9f46fa28cd1be174e2ad12bc2a3\``);
        await queryRunner.query(`ALTER TABLE \`booking\` DROP FOREIGN KEY \`FK_4b8f1987d000342685b92252e8d\``);
        await queryRunner.query(`ALTER TABLE \`chat\` DROP FOREIGN KEY \`FK_580acbf39bdd5ec33812685e22b\``);
        await queryRunner.query(`ALTER TABLE \`chat\` DROP FOREIGN KEY \`FK_c2b21d8086193c56faafaf1b97c\``);
        await queryRunner.query(`ALTER TABLE \`chat\` DROP FOREIGN KEY \`FK_e80898653d773b4fc54bbdd3836\``);

        // Drop all tables
        await queryRunner.query(`DROP INDEX \`IDX_4c8f96ccf523e9a3faefd5bdd4\` ON \`account\``);
        await queryRunner.query(`DROP TABLE \`account\``);
        await queryRunner.query(`DROP TABLE \`notification\``);
        await queryRunner.query(`DROP TABLE \`bill\``);
        await queryRunner.query(`DROP TABLE \`course\``);
        await queryRunner.query(`DROP TABLE \`lecture\``);
        await queryRunner.query(`DROP TABLE \`class\``);
        await queryRunner.query(`DROP TABLE \`booking\``);
        await queryRunner.query(`DROP TABLE \`chat\``);
        await queryRunner.query(`DROP TABLE \`chatbox\``);
    }
}
