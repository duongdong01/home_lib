import { Module } from "@nestjs/common";
import { FavoriteController } from "./Favorites.controller";
import { FavoriteService } from "./favorites.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Favorite } from "./entity/favorite.entity";
import { UserModule } from "../user/user.module";
import { TrackModule } from "../track/track.module";
import { ArtistModule } from "../artist/artist.module";
import { AlbumModule } from "../album/album.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite]),
    UserModule,
    TrackModule,
    ArtistModule,
    AlbumModule,
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule {}
