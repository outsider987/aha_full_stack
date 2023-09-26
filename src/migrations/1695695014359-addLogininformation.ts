import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLogininformation1695695014359 implements MigrationInterface {
  name = 'AddLogininformation1695695014359';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`verify_email\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`verification_token\` varchar(255) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`expiration_date\` timestamp NOT NULL, \`verify_token\` varchar(255) NULL, \`user_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NULL, \`google_id\` varchar(255) NULL, \`provider\` varchar(255) NOT NULL, \`is_email_confirmed\` tinyint NOT NULL, \`reset_password_token\` varchar(255) NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`login_information\` (\`id\` int NOT NULL AUTO_INCREMENT, \`login_count\` int NOT NULL DEFAULT '0', \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`user_id\` int NULL, UNIQUE INDEX \`REL_8cd1ea2fac74e2ef5b94c99af6\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`verify_email\` ADD CONSTRAINT \`FK_987aa6c2886f5e97a768b3b99d4\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`login_information\` ADD CONSTRAINT \`FK_8cd1ea2fac74e2ef5b94c99af67\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`login_information\` DROP FOREIGN KEY \`FK_8cd1ea2fac74e2ef5b94c99af67\``
    );
    await queryRunner.query(
      `ALTER TABLE \`verify_email\` DROP FOREIGN KEY \`FK_987aa6c2886f5e97a768b3b99d4\``
    );
    await queryRunner.query(
      `DROP INDEX \`REL_8cd1ea2fac74e2ef5b94c99af6\` ON \`login_information\``
    );
    await queryRunner.query(`DROP TABLE \`login_information\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``
    );
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(`DROP TABLE \`verify_email\``);
  }
}
