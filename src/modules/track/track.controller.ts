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
import { TrackService } from "./track.service";
import { CreateTrackDto } from "./dto/create-track.dto";
import { Public } from "src/common/decorators/decorator.common";
import { IdParamDto, PaginateDto } from "src/common/dtos/dto.common";
import { UpdateTrackDto } from "./dto/update-track.dto";

@ApiTags("track")
@Controller("track")
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: "Create track" })
  @Post()
  async createTrack(
    @Body() createTrackInput: CreateTrackDto,
    @Request() req: any
  ) {
    return await this.trackService.createTrack({
      userId: req.user.id,
      createTrackInput,
    });
  }

  @Public()
  @ApiOperation({ summary: "Get track by Id" })
  @Get(":id")
  async getTrackById(@Param() { id }: IdParamDto) {
    return await this.trackService.getTrackById(id);
  }

  @Public()
  @ApiOperation({
    summary: "Get all Track",
  })
  @Get()
  async getAllTrack(@Query() paginateInput: PaginateDto) {
    return await this.trackService.getAllTrack(paginateInput);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Update track by Id" })
  @Put(":id")
  async updateTrackById(
    @Body() updateTrackInput: UpdateTrackDto,
    @Param() { id }: IdParamDto,
    @Request() req: any
  ) {
    return await this.trackService.updateTrackById({
      id,
      updateTrackInput,
      userId: req.user.id,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete track by Id",
  })
  @Delete("/:id")
  async deleteTrackById(@Param() { id }: IdParamDto, @Request() req: any) {
    return await this.trackService.deleteTrackById({
      id,
      userId: req.user.id,
    });
  }
}
