import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableArtist1706965587063 implements MigrationInterface {
    name = 'CreateTableArtist1706965587063'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "artist" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "grammy" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, CONSTRAINT "PK_55b76e71568b5db4d01d3e394ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "artist" ADD CONSTRAINT "FK_c821c057bc672361af5f5c7e1b9" FOREIGN KEY ("created_by") REFERENCES "persons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "artist" DROP CONSTRAINT "FK_c821c057bc672361af5f5c7e1b9"`);
        await queryRunner.query(`DROP TABLE "artist"`);
    }

}
