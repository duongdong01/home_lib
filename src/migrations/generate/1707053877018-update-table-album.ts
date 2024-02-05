import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableAlbum1707053877018 implements MigrationInterface {
    name = 'UpdateTableAlbum1707053877018'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "albums" DROP CONSTRAINT "FK_b6465bf462c2ffef5f066bc6f21"`);
        await queryRunner.query(`ALTER TABLE "albums" DROP CONSTRAINT "REL_b6465bf462c2ffef5f066bc6f2"`);
        await queryRunner.query(`ALTER TABLE "albums" ADD CONSTRAINT "FK_b6465bf462c2ffef5f066bc6f21" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "albums" DROP CONSTRAINT "FK_b6465bf462c2ffef5f066bc6f21"`);
        await queryRunner.query(`ALTER TABLE "albums" ADD CONSTRAINT "REL_b6465bf462c2ffef5f066bc6f2" UNIQUE ("artist_id")`);
        await queryRunner.query(`ALTER TABLE "albums" ADD CONSTRAINT "FK_b6465bf462c2ffef5f066bc6f21" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
