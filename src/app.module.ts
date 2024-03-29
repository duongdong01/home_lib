import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import appConfig from "./config/app.config";
import * as Joi from "joi";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseConfigExport } from "./config/database/postgres.config";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { ArtistModule } from "./modules/artist/artist.module";
import { AlbumModule } from "./modules/album/album.module";
import { TrackModule } from "./modules/track/track.module";
import { FavoriteModule } from "./modules/Favorites/favorites.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      load: [appConfig],
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid("development", "production", "test", "provision")
          .default("development"),
      }),
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(DatabaseConfigExport),
    AuthModule,
    UserModule,
    ArtistModule,
    AlbumModule,
    TrackModule,
    FavoriteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
