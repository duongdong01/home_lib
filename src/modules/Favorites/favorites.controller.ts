import { Controller, Delete, Get, Param, Post, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FavoriteService } from "./favorites.service";
import { IdParamDto } from "src/common/dtos/dto.common";

@ApiTags("favorites")
@Controller("favs")
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get all favorite by user",
  })
  @Get()
  async getAllFavByUser(@Request() req: any) {
    return await this.favoriteService.getAllFavByUser(req.user.id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create favorite track by trackId",
  })
  @Post("/track/:id")
  async createFavTrack(@Param() { id }: IdParamDto, @Request() req: any) {
    return await this.favoriteService.createFavTrack({
      trackId: id,
      userId: req.user.id,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete favorite track by trackId",
  })
  @Delete("/track/:id")
  async deleteFavTrack(@Param() { id }: IdParamDto, @Request() req: any) {
    return await this.favoriteService.deleteFavTrack({
      trackId: id,
      userId: req.user.id,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create favorite album by albumId",
  })
  @Post("/album/:id")
  async createFavAlbum(@Param() { id }: IdParamDto, @Request() req: any) {
    return await this.favoriteService.createFavAlbum({
      albumId: id,
      userId: req.user.id,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete favorite album by albumId",
  })
  @Delete("/album/:id")
  async deleteFavAlbum(@Param() { id }: IdParamDto, @Request() req: any) {
    return await this.favoriteService.deleteFavAlbum({
      albumId: id,
      userId: req.user.id,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create favorite artist by artistId",
  })
  @Post("/artist/:id")
  async createFavArtist(@Param() { id }: IdParamDto, @Request() req: any) {
    return await this.favoriteService.createFavArtist({
      artistId: id,
      userId: req.user.id,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete favorite artist by artistId",
  })
  @Delete("/artist/:id")
  async deleteFavArtist(@Param() { id }: IdParamDto, @Request() req: any) {
    return await this.favoriteService.deleteFavArtist({
      artistId: id,
      userId: req.user.id,
    });
  }
}
