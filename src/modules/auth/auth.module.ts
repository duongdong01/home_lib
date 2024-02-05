import { Module } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("app.jwtSecret"),
        signOptions: {
          expiresIn: configService.get<string>("app.tokenExpiresTime"),
        },
      }),
      inject: [ConfigService],
    }),
    UserModule
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
  ],
  exports: [AuthModule],
})
export class AuthModule {}
