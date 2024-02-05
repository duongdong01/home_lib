import { Module } from "@nestjs/common";
import { AlbumController } from "./album.controller";
import { AlbumService } from "./album.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Album } from "./entity/album.entity";
import { ArtistModule } from "../artist/artist.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Album]), ArtistModule, UserModule],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
