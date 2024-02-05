import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { TRACK_MODEL, Track } from "./entity/track.entity";
import { EntityManager, Like, Repository } from "typeorm";
import { CreateTrackDto } from "./dto/create-track.dto";
import { AlbumService } from "../album/album.service";
import { ArtistService } from "../artist/artist.service";
import { ReturnCommon, paginating } from "src/common/utilities/base-response";
import { EResponse } from "src/common/interface.common";
import { UpdateTrackDto } from "./dto/update-track.dto";
import { UserService } from "../user/user.service";
import { PaginateDto } from "src/common/dtos/dto.common";

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private readonly TrackRepository: Repository<Track>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
    private readonly userService: UserService
  ) {}

  async createTrack({
    userId,
    createTrackInput,
  }: {
    userId: string;
    createTrackInput: CreateTrackDto;
  }) {
    const { duration, name, albumId, artistId } = createTrackInput;

    let albumFound = null;
    if (albumId) {
      albumFound = await this.albumService.findAlbumById(albumId);
      if (!albumFound) {
        throw new BadRequestException("Album not found");
      }
    }

    let artistFound = null;

    if (artistId) {
      artistFound = await this.artistService.findArtistById(albumId);
      if (!artistFound) {
        throw new BadRequestException("Artist not found");
      }
    }
    const user = await this.userService.findUserById(userId);
    const requirement = {
      name,
      duration,
      ...(albumId ? { album: albumFound } : {}),
      ...(artistId ? { artist: artistFound } : {}),
      person: user,
    };

    const newTrack = this.TrackRepository.create(requirement);
    const toSaveTrack = await this.TrackRepository.save(newTrack);

    return ReturnCommon({
      statusCode: HttpStatus.CREATED,
      status: EResponse.SUCCESS,
      data: { track: toSaveTrack },
      message: "Create track successfully",
    });
  }

  async getTrackById(id: string) {
    const trackFound = await this.TrackRepository.findOne({ where: { id } });

    if (!trackFound) {
      throw new NotFoundException("Track not found");
    }
    return ReturnCommon({
      statusCode: HttpStatus.CREATED,
      status: EResponse.SUCCESS,
      data: { track: trackFound },
      message: "Get track by id successfully",
    });
  }

  async updateTrackById({
    updateTrackInput,
    id,
    userId,
  }: {
    updateTrackInput: UpdateTrackDto;
    id: string;
    userId: string;
  }) {
    if (!Object.keys(updateTrackInput).length) {
      throw new BadRequestException("Data update invalid");
    }
    const { albumId, artistId, duration, name } = updateTrackInput;

    const trackFound = await this.TrackRepository.findOne({
      where: { id },
      relations: { person: true },
    });
    if (!trackFound) {
      throw new NotFoundException("Track not found");
    }
    if (trackFound.person?.id !== userId) {
      throw new BadRequestException("Permission failed");
    }

    let albumFound = null;
    if (albumId) {
      albumFound = await this.albumService.findAlbumById(albumId);
      if (!albumFound) {
        throw new BadRequestException("Album not found");
      }
    }

    let artistFound = null;
    if (artistId) {
      artistFound = await this.artistService.findArtistById(albumId);
      if (!artistFound) {
        throw new BadRequestException("Artist not found");
      }
    }
    const requirement = {
      name,
      duration,
      ...(artistId === null
        ? { artist: null }
        : artistId
        ? { artist: artistFound }
        : {}),
      ...(albumId === null
        ? { album: null }
        : albumId
        ? { album: artistFound }
        : {}),
    };
    const track = (
      await this.entityManager
        .getRepository(Track)
        .createQueryBuilder(TRACK_MODEL)
        .update(Track)
        .set(requirement)
        .where("tracks.id  = :id", { id })
        .returning("*")
        .execute()
    ).raw[0];

    return ReturnCommon({
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
      data: { track },
      message: "Update track successfully",
    });
  }

  async deleteTrackById({ id, userId }: { id: string; userId: string }) {
    const trackFound = await this.TrackRepository.findOne({
      where: { id },
      relations: { person: true },
    });

    if (!trackFound) {
      throw new NotFoundException("Track not found");
    }

    if (trackFound.person?.id !== userId) {
      throw new BadRequestException("Permission failed");
    }

    await this.TrackRepository.delete({ id });

    return ReturnCommon({
      statusCode: HttpStatus.NO_CONTENT,
      status: EResponse.SUCCESS,
      data: {},
      message: "Delete Track successfully",
    });
  }

  async getAllTrack(paginateInput: PaginateDto) {
    const { keyword, limit, page } = paginateInput;

    const vLimit = limit && Number(limit) > 0 ? Number(limit) : 10;
    const vPage = page && Number(page) > 0 ? Number(page) : 1;
    const offSet = (vPage - 1) * vLimit;
    const users = await this.TrackRepository.find({
      ...(keyword ? { where: { name: Like(`%${keyword}%`) } } : {}),
      relations: { artist: true, album: true },
      take: vLimit,
      skip: offSet,
    });
    const totalDoc = await this.TrackRepository.count({
      ...(keyword ? { where: { name: Like(`%${keyword}%`) } } : {}),
    });
    const pageDetail = paginating({
      totalDocs: totalDoc,
      page: vPage,
      limit: vLimit,
    });
    return ReturnCommon({
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
      data: { pageDetail, users },
      message: "Get all Album successfully",
    });
  }

  async findTrackById(id: string) {
    return await this.TrackRepository.findOne({ where: { id } });
  }
}
