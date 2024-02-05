import { Module } from "@nestjs/common";
import { ArtistController } from "./artist.controller";
import { ArtistService } from "./artist.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Artist } from "./entity/artist.entity";
import { UserModule } from "../user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Artist]), UserModule],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
