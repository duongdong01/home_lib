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
import { ArtistService } from "./artist.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateArtistDto } from "./dto/create-artist.dto";
import { Public } from "src/common/decorators/decorator.common";
import { IdParamDto, PaginateDto } from "src/common/dtos/dto.common";
import { UpdateArtistDto } from "./dto/update-artist.dto";

@ApiTags("artist")
@Controller("artist")
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create artist",
  })
  @Post()
  async createArtist(
    @Body() createArtistInput: CreateArtistDto,
    @Request() req: any
  ) {
    return await this.artistService.createArtist({
      userId: req.user.id,
      createArtistInput,
    });
  }

  @Public()
  @ApiOperation({
    summary: "get artist by id",
  })
  @Get("/:id")
  async getArtistById(@Param() { id }: IdParamDto) {
    return await this.artistService.getArtistById(id);
  }

  @Public()
  @ApiOperation({
    summary: "Get all artist",
  })
  @Get()
  async getAllArtist(@Query() paginateInput: PaginateDto) {
    return await this.artistService.getAllArtist(paginateInput);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "update artist",
  })
  @Put("/:id")
  async updateArtist(
    @Request() req: any,
    @Body() updateArtistInput: UpdateArtistDto,
    @Param() { id }: IdParamDto
  ) {
    return await this.artistService.updateArtist({
      userId: req.user.id,
      updateArtistInput,
      id,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete artist",
  })
  @Delete("/:id")
  async deleteArtist(@Request() req: any, @Param() { id }: IdParamDto) {
    return await this.artistService.deleteArtist({
      userId: req.user.id,
      id,
    });
  }
}
