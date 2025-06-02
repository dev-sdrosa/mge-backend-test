import { MigrationInterface, QueryRunner } from "typeorm";

export class OuProjectsRelations1748841492468 implements MigrationInterface {
    name = 'OuProjectsRelations1748841492468'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizational_units" ADD "project_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organizational_units" ADD CONSTRAINT "FK_6fb51564b2e6694782fa742eaa3" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizational_units" DROP CONSTRAINT "FK_6fb51564b2e6694782fa742eaa3"`);
        await queryRunner.query(`ALTER TABLE "organizational_units" DROP COLUMN "project_id"`);
    }

}
