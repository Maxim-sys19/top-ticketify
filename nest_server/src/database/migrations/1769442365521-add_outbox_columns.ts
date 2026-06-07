import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOutboxColumns1769442365521 implements MigrationInterface {
  name = 'AddOutboxColumns1769442365521';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`outbox\` ADD \`exchange\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`outbox\` ADD \`routingKey\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`outbox\` ADD \`processedAt\` datetime NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`outbox\` DROP COLUMN \`processedAt\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`outbox\` DROP COLUMN \`routingKey\``,
    );
    await queryRunner.query(`ALTER TABLE \`outbox\` DROP COLUMN \`exchange\``);
  }
}
