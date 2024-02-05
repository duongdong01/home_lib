import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableFavorite1707067090584 implements MigrationInterface {
    name = 'UpdateTableFavorite1707067090584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favorites" ADD "type" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favorites" DROP COLUMN "type"`);
    }

}
