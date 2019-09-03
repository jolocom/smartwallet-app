import { MigrationInterface, QueryRunner } from 'typeorm/browser'

export class Shards1567502093039 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "shard" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "label" varchar NOT NULL, "value" varchar NOT NULL)`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "shard"`)
  }
}
