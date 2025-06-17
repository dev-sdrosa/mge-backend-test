import { MigrationInterface, QueryRunner } from "typeorm";

export class ProjectsUserJunctionTable1750154052961 implements MigrationInterface {
    name = 'ProjectsUserJunctionTable1750154052961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transfers_type_enum" AS ENUM('inbound', 'outbound', 'internal')`);
        await queryRunner.query(`CREATE TABLE "transfers" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" "public"."transfers_type_enum" NOT NULL DEFAULT 'inbound', "vehicle_id" integer NOT NULL, "client_id" integer, "transmitter_id" integer NOT NULL, "project_id" integer, "organizational_unit_id" integer, "transfer_date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f712e908b465e0085b4408cabc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_users" ("project_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_4d392d4703ae37be0cc9a253175" PRIMARY KEY ("project_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3a53b25fef9b1ac81501a2816a" ON "project_users" ("project_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_076af26ee5a7bbcce3f77bfddf" ON "project_users" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "transfers" ADD CONSTRAINT "FK_4a5eedc863f271f9a6c9a17dab3" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfers" ADD CONSTRAINT "FK_9249ca69c046f687f06bafa43bb" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfers" ADD CONSTRAINT "FK_b51bdb870765d09872dd4400451" FOREIGN KEY ("transmitter_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfers" ADD CONSTRAINT "FK_fc2701ec117b3be7833dd385de0" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfers" ADD CONSTRAINT "FK_74d763f971b949e14a946b2fbe8" FOREIGN KEY ("organizational_unit_id") REFERENCES "organizational_units"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_users" ADD CONSTRAINT "FK_3a53b25fef9b1ac81501a2816a5" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_users" ADD CONSTRAINT "FK_076af26ee5a7bbcce3f77bfddfb" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_users" DROP CONSTRAINT "FK_076af26ee5a7bbcce3f77bfddfb"`);
        await queryRunner.query(`ALTER TABLE "project_users" DROP CONSTRAINT "FK_3a53b25fef9b1ac81501a2816a5"`);
        await queryRunner.query(`ALTER TABLE "transfers" DROP CONSTRAINT "FK_74d763f971b949e14a946b2fbe8"`);
        await queryRunner.query(`ALTER TABLE "transfers" DROP CONSTRAINT "FK_fc2701ec117b3be7833dd385de0"`);
        await queryRunner.query(`ALTER TABLE "transfers" DROP CONSTRAINT "FK_b51bdb870765d09872dd4400451"`);
        await queryRunner.query(`ALTER TABLE "transfers" DROP CONSTRAINT "FK_9249ca69c046f687f06bafa43bb"`);
        await queryRunner.query(`ALTER TABLE "transfers" DROP CONSTRAINT "FK_4a5eedc863f271f9a6c9a17dab3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_076af26ee5a7bbcce3f77bfddf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3a53b25fef9b1ac81501a2816a"`);
        await queryRunner.query(`DROP TABLE "project_users"`);
        await queryRunner.query(`DROP TABLE "transfers"`);
        await queryRunner.query(`DROP TYPE "public"."transfers_type_enum"`);
    }

}
