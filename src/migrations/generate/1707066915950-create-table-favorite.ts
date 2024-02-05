import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableFavorite1707066915950 implements MigrationInterface {
    name = 'CreateTableFavorite1707066915950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tracks" DROP CONSTRAINT "FK_495f8b68c75ac5c9b0301a85b32"`);
        await queryRunner.query(`ALTER TABLE "tracks" DROP CONSTRAINT "FK_fceb1d9483fda6a312af244a80e"`);
        await queryRunner.query(`CREATE TABLE "favorites" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "artist_id" uuid, "album_id" uuid, "track_id" uuid, CONSTRAINT "PK_890818d27523748dd36a4d1bdc8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tracks" ADD CONSTRAINT "FK_495f8b68c75ac5c9b0301a85b32" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tracks" ADD CONSTRAINT "FK_fceb1d9483fda6a312af244a80e" FOREIGN KEY ("album_id") REFERENCES "albums"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorites" ADD CONSTRAINT "FK_0b379143b23ad89c1f7cdcdd9ae" FOREIGN KEY ("created_by") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorites" ADD CONSTRAINT "FK_9c7c756540b38ffe4e419c8bc99" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorites" ADD CONSTRAINT "FK_2e46772aaeeaa9770bdb59d4668" FOREIGN KEY ("album_id") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorites" ADD CONSTRAINT "FK_d8d3b0b8b67970531d4a097a100" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_d8d3b0b8b67970531d4a097a100"`);
        await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_2e46772aaeeaa9770bdb59d4668"`);
        await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_9c7c756540b38ffe4e419c8bc99"`);
        await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_0b379143b23ad89c1f7cdcdd9ae"`);
        await queryRunner.query(`ALTER TABLE "tracks" DROP CONSTRAINT "FK_fceb1d9483fda6a312af244a80e"`);
        await queryRunner.query(`ALTER TABLE "tracks" DROP CONSTRAINT "FK_495f8b68c75ac5c9b0301a85b32"`);
        await queryRunner.query(`DROP TABLE "favorites"`);
        await queryRunner.query(`ALTER TABLE "tracks" ADD CONSTRAINT "FK_fceb1d9483fda6a312af244a80e" FOREIGN KEY ("album_id") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tracks" ADD CONSTRAINT "FK_495f8b68c75ac5c9b0301a85b32" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
