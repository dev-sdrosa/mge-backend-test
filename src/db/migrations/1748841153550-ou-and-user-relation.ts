import { MigrationInterface, QueryRunner } from "typeorm";

export class OuAndUserRelation1748841153550 implements MigrationInterface {
    name = 'OuAndUserRelation1748841153550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organizational_units" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, CONSTRAINT "PK_d818d009beb8256752e477fe4c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_organizational_units" ("organizational_unit_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_dbaf53ab590da9060df9bba295c" PRIMARY KEY ("organizational_unit_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fc7214d6fb44ac76f1e2e3843a" ON "user_organizational_units" ("organizational_unit_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_556f6823c97e6d249b574cd488" ON "user_organizational_units" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "user_organizational_units" ADD CONSTRAINT "FK_fc7214d6fb44ac76f1e2e3843a8" FOREIGN KEY ("organizational_unit_id") REFERENCES "organizational_units"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_organizational_units" ADD CONSTRAINT "FK_556f6823c97e6d249b574cd4883" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_organizational_units" DROP CONSTRAINT "FK_556f6823c97e6d249b574cd4883"`);
        await queryRunner.query(`ALTER TABLE "user_organizational_units" DROP CONSTRAINT "FK_fc7214d6fb44ac76f1e2e3843a8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_556f6823c97e6d249b574cd488"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fc7214d6fb44ac76f1e2e3843a"`);
        await queryRunner.query(`DROP TABLE "user_organizational_units"`);
        await queryRunner.query(`DROP TABLE "organizational_units"`);
    }

}
