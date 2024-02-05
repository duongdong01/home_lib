import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableTrack1707060493178 implements MigrationInterface {
    name = 'CreateTableTrack1707060493178'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tracks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "duration" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "artist_id" uuid, "album_id" uuid, CONSTRAINT "PK_242a37ffc7870380f0e611986e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tracks" ADD CONSTRAINT "FK_9aa6ca4b42741d84d1faf0be0a1" FOREIGN KEY ("created_by") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tracks" ADD CONSTRAINT "FK_495f8b68c75ac5c9b0301a85b32" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tracks" ADD CONSTRAINT "FK_fceb1d9483fda6a312af244a80e" FOREIGN KEY ("album_id") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tracks" DROP CONSTRAINT "FK_fceb1d9483fda6a312af244a80e"`);
        await queryRunner.query(`ALTER TABLE "tracks" DROP CONSTRAINT "FK_495f8b68c75ac5c9b0301a85b32"`);
        await queryRunner.query(`ALTER TABLE "tracks" DROP CONSTRAINT "FK_9aa6ca4b42741d84d1faf0be0a1"`);
        await queryRunner.query(`DROP TABLE "tracks"`);
    }

}
