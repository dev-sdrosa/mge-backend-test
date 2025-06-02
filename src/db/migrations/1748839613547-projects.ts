import { MigrationInterface, QueryRunner } from "typeorm";

export class Projects1748839613547 implements MigrationInterface {
    name = 'Projects1748839613547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "projects" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "description" text, CONSTRAINT "UQ_2187088ab5ef2a918473cb99007" UNIQUE ("name"), CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "projects"`);
    }

}
