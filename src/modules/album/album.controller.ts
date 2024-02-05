import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AlbumService } from "./album.service";
import { CreateAlbumDto } from "./dto/create-album.dto";
import { Public } from "src/common/decorators/decorator.common";
import { IdParamDto, PaginateDto } from "src/common/dtos/dto.common";
import { UpdateAlbumDto } from "./dto/update-album.dto";

@ApiTags("album")
@Controller("album")
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create album",
  })
  @Post()
  async createAlbum(
    @Body() createAlbumInput: CreateAlbumDto,
    @Request() req: any
  ) {
    return await this.albumService.createAlbum({
      userId: req.user.id,
      createAlbumInput,
    });
  }

  @Public()
  @ApiOperation({
    summary: "Get all album",
  })
  @Get()
  async getAllAlbum(@Query() paginateInput: PaginateDto) {
    return await this.albumService.getAllAlbum(paginateInput);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update  album by Id",
  })
  @Put("/:id")
  async updateAlbum(
    @Body() updateAlbumInput: UpdateAlbumDto,
    @Param() { id }: IdParamDto,
    @Request() req: any
  ) {
    return await this.albumService.updateAlbum({
      updateAlbumInput,
      id,
      userId: req.user.id,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete  album by Id",
  })
  @Delete("/:id")
  async deleteAlbumById(@Param() { id }: IdParamDto, @Request() req: any) {
    return await this.albumService.deleteAlbumById({
      id,
      userId: req.user.id,
    });
  }
}
