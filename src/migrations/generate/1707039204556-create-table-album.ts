import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableAlbum1707039204556 implements MigrationInterface {
    name = 'CreateTableAlbum1707039204556'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "artist" DROP CONSTRAINT "FK_c821c057bc672361af5f5c7e1b9"`);
        await queryRunner.query(`CREATE TABLE "albums" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "year" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "artist_id" uuid, CONSTRAINT "REL_b6465bf462c2ffef5f066bc6f2" UNIQUE ("artist_id"), CONSTRAINT "PK_838ebae24d2e12082670ffc95d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "artist" ADD CONSTRAINT "FK_c821c057bc672361af5f5c7e1b9" FOREIGN KEY ("created_by") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "albums" ADD CONSTRAINT "FK_295ee1f3412e65c9f79cfeb057c" FOREIGN KEY ("created_by") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "albums" ADD CONSTRAINT "FK_b6465bf462c2ffef5f066bc6f21" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "albums" DROP CONSTRAINT "FK_b6465bf462c2ffef5f066bc6f21"`);
        await queryRunner.query(`ALTER TABLE "albums" DROP CONSTRAINT "FK_295ee1f3412e65c9f79cfeb057c"`);
        await queryRunner.query(`ALTER TABLE "artist" DROP CONSTRAINT "FK_c821c057bc672361af5f5c7e1b9"`);
        await queryRunner.query(`DROP TABLE "albums"`);
        await queryRunner.query(`ALTER TABLE "artist" ADD CONSTRAINT "FK_c821c057bc672361af5f5c7e1b9" FOREIGN KEY ("created_by") REFERENCES "persons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
