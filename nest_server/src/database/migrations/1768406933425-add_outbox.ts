import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOutbox1768406933425 implements MigrationInterface {
  name = 'AddOutbox1768406933425';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`outbox\` (\`id\` int NOT NULL AUTO_INCREMENT, \`aggregateType\` varchar(255) NOT NULL, \`aggregateId\` varchar(255) NOT NULL, \`eventType\` varchar(255) NOT NULL, \`payload\` json NOT NULL, \`processed\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`outbox\``);
  }
}
