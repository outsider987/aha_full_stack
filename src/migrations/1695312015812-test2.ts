import { MigrationInterface, QueryRunner } from "typeorm";

export class Test21695312015812 implements MigrationInterface {
    name = 'Test21695312015812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`login_information\` (\`id\` int NOT NULL AUTO_INCREMENT, \`signUpTimestamp\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`loginCount\` int NOT NULL DEFAULT '0', \`lastSessionTimestamp\` timestamp NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`verify_email\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`verification_token\` varchar(255) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`expiration_date\` timestamp NOT NULL, \`verify_token\` varchar(255) NULL, \`user_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userName\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`googleId\` varchar(255) NULL, \`provider\` varchar(255) NOT NULL, \`isEmailConfirmed\` tinyint NOT NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`refresh_tokens\` (\`token_id\` int NOT NULL AUTO_INCREMENT, \`expiration\` timestamp NOT NULL, \`refreshToken\` varchar(255) NOT NULL, \`user_id\` int NULL, PRIMARY KEY (\`token_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`verify_email\` ADD CONSTRAINT \`FK_987aa6c2886f5e97a768b3b99d4\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`refresh_tokens\` ADD CONSTRAINT \`FK_3ddc983c5f7bcf132fd8732c3f4\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`refresh_tokens\` DROP FOREIGN KEY \`FK_3ddc983c5f7bcf132fd8732c3f4\``);
        await queryRunner.query(`ALTER TABLE \`verify_email\` DROP FOREIGN KEY \`FK_987aa6c2886f5e97a768b3b99d4\``);
        await queryRunner.query(`DROP TABLE \`refresh_tokens\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`verify_email\``);
        await queryRunner.query(`DROP TABLE \`login_information\``);
    }

}
