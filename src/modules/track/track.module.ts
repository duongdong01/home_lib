import { Module } from "@nestjs/common";
import { TrackController } from "./track.controller";
import { TrackService } from "./track.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Track } from "./entity/track.entity";
import { AlbumModule } from "../album/album.module";
import { ArtistModule } from "../artist/artist.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Track]),
    AlbumModule,
    ArtistModule,
    UserModule,
  ],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
