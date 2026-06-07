import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1768151017233 implements MigrationInterface {
  name = 'Init1768151017233';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`reset_password_token\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` varchar(255) NOT NULL, \`token\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`expiresAt\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NULL, \`authProvider\` enum ('local', 'google', 'github', 'facebook') NOT NULL DEFAULT 'local', \`status\` enum ('pending', 'active') NULL DEFAULT 'pending', \`avatar\` longblob NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`type\` varchar(255) NOT NULL, \`companyId\` int NULL, INDEX \`IDX_94e2000b5f7ee1f9c491f0f8a8\` (\`type\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`role_name\` enum ('admin_user', 'company_user', 'user') NOT NULL DEFAULT 'user', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`company\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`type\` varchar(255) NOT NULL, INDEX \`IDX_6552f91b22b29add87eb9c5df2\` (\`type\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`ticket\` (\`id\` varchar(36) NOT NULL, \`passenger_name\` varchar(50) NOT NULL, \`price\` decimal(10,2) NOT NULL, \`journey_day\` timestamp NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`type\` varchar(255) NOT NULL, \`transportId\` int NULL, \`routeId\` int NULL, INDEX \`IDX_429b856ba7bcc9cfb6dcef873c\` (\`type\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`transport\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`description\` varchar(255) NOT NULL, \`capacity\` int NOT NULL, \`maintenanceDate\` date NULL, \`isActive\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`type\` varchar(255) NOT NULL, \`companyId\` int NULL, INDEX \`IDX_3186a4a5fe0084b779f6ba704a\` (\`type\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`routes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`routeName\` varchar(255) NOT NULL, \`start\` json NOT NULL, \`end\` json NOT NULL, \`start_address\` varchar(255) NOT NULL, \`start_lat\` decimal(10,7) AS (JSON_UNQUOTE(JSON_EXTRACT(\`start\`, '$.lat'))) STORED NOT NULL, \`start_lng\` decimal(10,7) AS (JSON_UNQUOTE(JSON_EXTRACT(\`start\`, '$.lng'))) STORED NOT NULL, \`end_lat\` decimal(10,7) AS (JSON_UNQUOTE(JSON_EXTRACT(\`end\`, '$.lat'))) STORED NOT NULL, \`end_lng\` decimal(10,7) AS (JSON_UNQUOTE(JSON_EXTRACT(\`end\`, '$.lng'))) STORED NOT NULL, \`end_address\` varchar(255) NOT NULL, \`distance_meters\` json NOT NULL, \`duration_seconds\` json NOT NULL, \`routeCode\` varchar(100) NULL, \`uid\` varchar(255) NOT NULL, \`departureTime\` timestamp NOT NULL, \`arrivalTime\` timestamp NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`distance_val\` int AS (JSON_UNQUOTE(JSON_EXTRACT(distance_meters, '$.value'))) STORED NOT NULL, \`duration_val\` int AS (JSON_UNQUOTE(JSON_EXTRACT(duration_seconds, '$.value'))) STORED NOT NULL, \`type\` varchar(255) NOT NULL, \`companyId\` int NULL, INDEX \`IDX_28f8f8267b4ff14449d94c58b7\` (\`start_lat\`), INDEX \`IDX_19fe71b921280333f66812204e\` (\`start_lng\`), INDEX \`IDX_fda4473388d50d3573b9b99fde\` (\`end_lat\`), INDEX \`IDX_084ec0e316a0f88e3c0de437c1\` (\`end_lng\`), INDEX \`IDX_9c029d8156bcff3610be8b6d92\` (\`distance_val\`), INDEX \`IDX_cf04f87cd5d4969fa33609ee81\` (\`duration_val\`), UNIQUE INDEX \`IDX_cf9354dbb88f1ae5c12af2460f\` (\`routeCode\`), UNIQUE INDEX \`IDX_a1831228dea738f2bd869d15fe\` (\`uid\`), INDEX \`IDX_e5a930b7e6031e9fa9932695bf\` (\`type\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `INSERT INTO \`TopTicketify\`.\`typeorm_metadata\`(\`database\`, \`schema\`, \`table\`, \`type\`, \`name\`, \`value\`) VALUES (DEFAULT, ?, ?, ?, ?, ?)`,
      [
        'TopTicketify',
        'routes',
        'GENERATED_COLUMN',
        'start_lat',
        "JSON_UNQUOTE(JSON_EXTRACT(`start`, '$.lat'))",
      ],
    );
    await queryRunner.query(
      `INSERT INTO \`TopTicketify\`.\`typeorm_metadata\`(\`database\`, \`schema\`, \`table\`, \`type\`, \`name\`, \`value\`) VALUES (DEFAULT, ?, ?, ?, ?, ?)`,
      [
        'TopTicketify',
        'routes',
        'GENERATED_COLUMN',
        'start_lng',
        "JSON_UNQUOTE(JSON_EXTRACT(`start`, '$.lng'))",
      ],
    );
    await queryRunner.query(
      `INSERT INTO \`TopTicketify\`.\`typeorm_metadata\`(\`database\`, \`schema\`, \`table\`, \`type\`, \`name\`, \`value\`) VALUES (DEFAULT, ?, ?, ?, ?, ?)`,
      [
        'TopTicketify',
        'routes',
        'GENERATED_COLUMN',
        'end_lat',
        "JSON_UNQUOTE(JSON_EXTRACT(`end`, '$.lat'))",
      ],
    );
    await queryRunner.query(
      `INSERT INTO \`TopTicketify\`.\`typeorm_metadata\`(\`database\`, \`schema\`, \`table\`, \`type\`, \`name\`, \`value\`) VALUES (DEFAULT, ?, ?, ?, ?, ?)`,
      [
        'TopTicketify',
        'routes',
        'GENERATED_COLUMN',
        'end_lng',
        "JSON_UNQUOTE(JSON_EXTRACT(`end`, '$.lng'))",
      ],
    );
    await queryRunner.query(
      `INSERT INTO \`TopTicketify\`.\`typeorm_metadata\`(\`database\`, \`schema\`, \`table\`, \`type\`, \`name\`, \`value\`) VALUES (DEFAULT, ?, ?, ?, ?, ?)`,
      [
        'TopTicketify',
        'routes',
        'GENERATED_COLUMN',
        'distance_val',
        "JSON_UNQUOTE(JSON_EXTRACT(distance_meters, '$.value'))",
      ],
    );
    await queryRunner.query(
      `INSERT INTO \`TopTicketify\`.\`typeorm_metadata\`(\`database\`, \`schema\`, \`table\`, \`type\`, \`name\`, \`value\`) VALUES (DEFAULT, ?, ?, ?, ?, ?)`,
      [
        'TopTicketify',
        'routes',
        'GENERATED_COLUMN',
        'duration_val',
        "JSON_UNQUOTE(JSON_EXTRACT(duration_seconds, '$.value'))",
      ],
    );
    await queryRunner.query(
      `CREATE TABLE \`seats\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(100) NOT NULL, \`isAvailable\` tinyint NOT NULL DEFAULT 1, \`locked_until\` datetime NULL, \`looked_by_booking\` varchar(36) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`type\` varchar(255) NOT NULL, \`transportId\` int NULL, INDEX \`IDX_d66a448df655d9670ea42464bf\` (\`type\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`bookings\` (\`id\` varchar(36) NOT NULL, \`userId\` varchar(36) NOT NULL, \`routeId\` varchar(36) NOT NULL, \`transportId\` varchar(36) NOT NULL, \`seatIds\` json NOT NULL, \`status\` enum ('BOOKED', 'CONFIRMED', 'CANCELLED', 'REJECTED', 'COMPLETED', 'EXPIRED', 'PENDING', 'FAILED') NOT NULL DEFAULT 'PENDING', \`uniqueId\` varchar(255) NOT NULL, \`companyId\` varchar(36) NOT NULL, \`bookingTime\` datetime NOT NULL, \`expirationTime\` datetime NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, INDEX \`IDX_7b7bbda70211a85f7aea7922de\` (\`userId\`, \`routeId\`), UNIQUE INDEX \`IDX_64ed35c04b3b9399a46f12b029\` (\`uniqueId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_6f9395c9037632a31107c8a9e58\` FOREIGN KEY (\`companyId\`) REFERENCES \`company\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles\` ADD CONSTRAINT \`FK_c8db5603420d119933bbc5c398c\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_8ccf2f56e848d86501fb95db4e2\` FOREIGN KEY (\`transportId\`) REFERENCES \`transport\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_2a65185bcb46dc9704a16356850\` FOREIGN KEY (\`routeId\`) REFERENCES \`routes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transport\` ADD CONSTRAINT \`FK_92eca45a0aabb3e52113e57a23f\` FOREIGN KEY (\`companyId\`) REFERENCES \`company\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`routes\` ADD CONSTRAINT \`FK_46a82fa51b26ea2c331fef3ba96\` FOREIGN KEY (\`companyId\`) REFERENCES \`company\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`seats\` ADD CONSTRAINT \`FK_2ec75b8f697b73eaaa87482843e\` FOREIGN KEY (\`transportId\`) REFERENCES \`transport\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`seats\` DROP FOREIGN KEY \`FK_2ec75b8f697b73eaaa87482843e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`routes\` DROP FOREIGN KEY \`FK_46a82fa51b26ea2c331fef3ba96\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`transport\` DROP FOREIGN KEY \`FK_92eca45a0aabb3e52113e57a23f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` DROP FOREIGN KEY \`FK_2a65185bcb46dc9704a16356850\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` DROP FOREIGN KEY \`FK_8ccf2f56e848d86501fb95db4e2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles\` DROP FOREIGN KEY \`FK_c8db5603420d119933bbc5c398c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_6f9395c9037632a31107c8a9e58\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_64ed35c04b3b9399a46f12b029\` ON \`bookings\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_7b7bbda70211a85f7aea7922de\` ON \`bookings\``,
    );
    await queryRunner.query(`DROP TABLE \`bookings\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_d66a448df655d9670ea42464bf\` ON \`seats\``,
    );
    await queryRunner.query(`DROP TABLE \`seats\``);
    await queryRunner.query(
      `DELETE FROM \`TopTicketify\`.\`typeorm_metadata\` WHERE \`type\` = ? AND \`name\` = ? AND \`schema\` = ? AND \`table\` = ?`,
      ['GENERATED_COLUMN', 'duration_val', 'TopTicketify', 'routes'],
    );
    await queryRunner.query(
      `DELETE FROM \`TopTicketify\`.\`typeorm_metadata\` WHERE \`type\` = ? AND \`name\` = ? AND \`schema\` = ? AND \`table\` = ?`,
      ['GENERATED_COLUMN', 'distance_val', 'TopTicketify', 'routes'],
    );
    await queryRunner.query(
      `DELETE FROM \`TopTicketify\`.\`typeorm_metadata\` WHERE \`type\` = ? AND \`name\` = ? AND \`schema\` = ? AND \`table\` = ?`,
      ['GENERATED_COLUMN', 'end_lng', 'TopTicketify', 'routes'],
    );
    await queryRunner.query(
      `DELETE FROM \`TopTicketify\`.\`typeorm_metadata\` WHERE \`type\` = ? AND \`name\` = ? AND \`schema\` = ? AND \`table\` = ?`,
      ['GENERATED_COLUMN', 'end_lat', 'TopTicketify', 'routes'],
    );
    await queryRunner.query(
      `DELETE FROM \`TopTicketify\`.\`typeorm_metadata\` WHERE \`type\` = ? AND \`name\` = ? AND \`schema\` = ? AND \`table\` = ?`,
      ['GENERATED_COLUMN', 'start_lng', 'TopTicketify', 'routes'],
    );
    await queryRunner.query(
      `DELETE FROM \`TopTicketify\`.\`typeorm_metadata\` WHERE \`type\` = ? AND \`name\` = ? AND \`schema\` = ? AND \`table\` = ?`,
      ['GENERATED_COLUMN', 'start_lat', 'TopTicketify', 'routes'],
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_e5a930b7e6031e9fa9932695bf\` ON \`routes\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_a1831228dea738f2bd869d15fe\` ON \`routes\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_cf9354dbb88f1ae5c12af2460f\` ON \`routes\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_cf04f87cd5d4969fa33609ee81\` ON \`routes\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_9c029d8156bcff3610be8b6d92\` ON \`routes\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_084ec0e316a0f88e3c0de437c1\` ON \`routes\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_fda4473388d50d3573b9b99fde\` ON \`routes\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_19fe71b921280333f66812204e\` ON \`routes\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_28f8f8267b4ff14449d94c58b7\` ON \`routes\``,
    );
    await queryRunner.query(`DROP TABLE \`routes\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_3186a4a5fe0084b779f6ba704a\` ON \`transport\``,
    );
    await queryRunner.query(`DROP TABLE \`transport\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_429b856ba7bcc9cfb6dcef873c\` ON \`ticket\``,
    );
    await queryRunner.query(`DROP TABLE \`ticket\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_6552f91b22b29add87eb9c5df2\` ON \`company\``,
    );
    await queryRunner.query(`DROP TABLE \`company\``);
    await queryRunner.query(`DROP TABLE \`roles\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_94e2000b5f7ee1f9c491f0f8a8\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(`DROP TABLE \`reset_password_token\``);
  }
}
