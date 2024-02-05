import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { ALBUM_MODEL, Album } from "./entity/album.entity";
import { EntityManager, Like, Repository } from "typeorm";
import { CreateAlbumDto } from "./dto/create-album.dto";
import { ArtistService } from "../artist/artist.service";
import { UserService } from "../user/user.service";
import { ReturnCommon, paginating } from "src/common/utilities/base-response";
import { EResponse } from "src/common/interface.common";
import { PaginateDto } from "src/common/dtos/dto.common";
import { UpdateAlbumDto } from "./dto/update-album.dto";

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private readonly AlbumRepository: Repository<Album>,
    @InjectEntityManager() private entityManager: EntityManager,
    private readonly artistService: ArtistService,
    private readonly userService: UserService
  ) {}

  async createAlbum({
    userId,
    createAlbumInput,
  }: {
    userId: string;
    createAlbumInput: CreateAlbumDto;
  }) {
    const { artistId, name, year } = createAlbumInput;
    let artistFound = null;
    if (artistId) {
      artistFound = await this.artistService.findArtistById(artistId);
      if (!artistFound) {
        throw new BadRequestException("Artist not found");
      }
    }

    const checkNameExisted = await this.entityManager
      .getRepository(Album)
      .createQueryBuilder(ALBUM_MODEL)
      .where("albums.created_by  = :created_by", { created_by: userId })
      .andWhere("albums.name Ilike :name", {
        name,
      })
      .getOne();

    if (checkNameExisted) {
      throw new BadRequestException("Name existed");
    }
    const user = await this.userService.findUserById(userId);

    const newAlbum = this.AlbumRepository.create({
      person: user,
      name,
      artist: artistFound,
      year,
    });

    const toSaveAlbum = await this.AlbumRepository.save(newAlbum);
    return ReturnCommon({
      statusCode: HttpStatus.CREATED,
      status: EResponse.SUCCESS,
      data: { album: toSaveAlbum },
      message: "Create album successfully",
    });
  }

  async getAllAlbum(paginateInput: PaginateDto) {
    const { keyword, limit, page } = paginateInput;

    const vLimit = limit && Number(limit) > 0 ? Number(limit) : 10;
    const vPage = page && Number(page) > 0 ? Number(page) : 1;
    const offSet = (vPage - 1) * vLimit;
    const users = await this.AlbumRepository.find({
      ...(keyword ? { where: { name: Like(`%${keyword}%`) } } : {}),
      relations: { artist: true },
      take: vLimit,
      skip: offSet,
    });
    const totalDoc = await this.AlbumRepository.count({
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

  async updateAlbum({
    updateAlbumInput,
    id,
    userId,
  }: {
    updateAlbumInput: UpdateAlbumDto;
    id: string;
    userId: string;
  }) {
    if (!Object.keys(updateAlbumInput).length) {
      throw new BadRequestException("Data update invalid");
    }
    const { artistId, name, year } = updateAlbumInput;

    const albumFound = await this.AlbumRepository.findOne({
      where: { id },
      relations: { person: true },
    });

    if (!albumFound) {
      throw new NotFoundException("Album not found");
    }
    if (albumFound.person.id !== userId) {
      throw new BadRequestException("Permission failed");
    }

    if (name) {
      const checkNameExisted = await this.entityManager
        .getRepository(Album)
        .createQueryBuilder(ALBUM_MODEL)
        .where("albums.created_by  = :created_by", { created_by: userId })
        .andWhere("albums.name Ilike :name", {
          created_by: userId,
          name,
        })
        .getOne();
      if (checkNameExisted) {
        throw new BadRequestException("Name existed");
      }
    }

    let artistFound = null;

    if (artistId) {
      artistFound = await this.artistService.findArtistById(artistId);
      if (!artistFound) {
        throw new BadRequestException("Artist not found");
      }
    }

    const requirement = {
      name,
      year,
      ...(artistId === null
        ? { artist: null }
        : artistId
        ? { artist: artistFound }
        : {}),
    };

    const artist = (
      await this.entityManager
        .getRepository(Album)
        .createQueryBuilder(ALBUM_MODEL)
        .update(Album)
        .set(requirement)
        .where("albums.id  = :id", { id })
        .returning("*")
        .execute()
    ).raw[0];

    return ReturnCommon({
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
      data: { artist },
      message: "Update album successfully",
    });
  }

  async deleteAlbumById({ id, userId }: { id: string; userId: string }) {
    const albumFound = await this.AlbumRepository.findOne({
      where: { id },
      relations: { person: true },
    });

    if (!albumFound) {
      throw new NotFoundException("Album not found");
    }

    if (albumFound.person.id !== userId) {
      throw new BadRequestException("Permission failed");
    }

    await this.AlbumRepository.delete({ id });

    return ReturnCommon({
      statusCode: HttpStatus.NO_CONTENT,
      status: EResponse.SUCCESS,
      data: {},
      message: "Delete Album successfully",
    });
  }

  async findAlbumById(id: string) {
    return await this.AlbumRepository.findOne({ where: { id } });
  }
}
