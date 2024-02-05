import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ARTIST_MODEL, Artist } from "./entity/artist.entity";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Like, Repository } from "typeorm";
import { CreateArtistDto } from "./dto/create-artist.dto";
import { UserService } from "../user/user.service";
import { ReturnCommon, paginating } from "src/common/utilities/base-response";
import { EResponse } from "src/common/interface.common";
import { PaginateDto } from "src/common/dtos/dto.common";
import { UpdateArtistDto } from "./dto/update-artist.dto";

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly ArtistRepository: Repository<Artist>,
    @InjectEntityManager() private entityManager: EntityManager,
    private readonly userService: UserService
  ) {}

  async createArtist({
    userId,
    createArtistInput,
  }: {
    userId: string;
    createArtistInput: CreateArtistDto;
  }) {
    const { name } = createArtistInput;
    const checkNameExisted = await this.entityManager
      .getRepository(Artist)
      .createQueryBuilder(ARTIST_MODEL)
      .where("artist.created_by  = :created_by", { created_by: userId })
      .andWhere("artist.name Ilike :name", {
        name,
      })
      .getOne();
    if (checkNameExisted) {
      throw new BadRequestException("Name existed");
    }
    const person = await this.userService.findUserById(userId);
    const newArtist = this.ArtistRepository.create({
      ...createArtistInput,
      person: person,
    });
    const toSaveArtist = await this.ArtistRepository.save(newArtist);

    return ReturnCommon({
      statusCode: HttpStatus.CREATED,
      status: EResponse.SUCCESS,
      data: {
        artist: toSaveArtist,
      },
      message: "Create Artist successfully",
    });
  }

  async getArtistById(id: string) {
    const artistFound = await this.ArtistRepository.findOne({
      where: { id },
    });
    if (!artistFound) {
      throw new NotFoundException("Artist not found");
    }
    return ReturnCommon({
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
      data: { artist: artistFound },
      message: "Get artist by id successfully",
    });
  }

  async getAllArtist(paginateInput: PaginateDto) {
    const { keyword, limit, page } = paginateInput;

    const vLimit = limit && Number(limit) > 0 ? Number(limit) : 10;
    const vPage = page && Number(page) > 0 ? Number(page) : 1;
    const offSet = (vPage - 1) * vLimit;
    const users = await this.ArtistRepository.find({
      ...(keyword ? { where: { name: Like(`%${keyword}%`) } } : {}),
      take: vLimit,
      skip: offSet,
    });
    const totalDoc = await this.ArtistRepository.count({
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
      message: "Get all user successfully",
    });
  }

  async updateArtist({
    userId,
    updateArtistInput,
    id,
  }: {
    userId: string;
    updateArtistInput: UpdateArtistDto;
    id: string;
  }) {
    const { name } = updateArtistInput;
    const artistFound = await this.ArtistRepository.findOne({
      where: { id },
      relations: { person: true },
    });

    if (!artistFound) {
      throw new NotFoundException("Artist not found");
    }
    if (artistFound.person.id !== userId) {
      throw new BadRequestException("Permission failed");
    }

    if (name) {
      const checkNameExisted = await this.entityManager
        .getRepository(Artist)
        .createQueryBuilder(ARTIST_MODEL)
        .where("artist.created_by  = :created_by", { created_by: userId })
        .andWhere("artist.name Ilike :name", {
          created_by: userId,
          name,
        })
        .getOne();
      if (checkNameExisted) {
        throw new BadRequestException("Name existed");
      }
    }
    const artist = (
      await this.entityManager
        .getRepository(Artist)
        .createQueryBuilder(ARTIST_MODEL)
        .update(Artist)
        .set(updateArtistInput)
        .where("artist.id  = :id", { id })
        .returning("*")
        .execute()
    ).raw[0];

    return ReturnCommon({
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
      data: { artist },
      message: "Update artist successfully",
    });
  }

  async deleteArtist({ userId, id }: { userId: string; id: string }) {
    const artistFound = await this.entityManager
      .getRepository(Artist)
      .createQueryBuilder(ARTIST_MODEL)
      .where("artist.created_by = :userId AND artist.id =:id ", { userId, id })
      .getOne();

    if (!artistFound) {
      throw new BadRequestException("Artist not found");
    }
    await this.ArtistRepository.delete({ id });
    return ReturnCommon({
      statusCode: HttpStatus.NO_CONTENT,
      status: EResponse.SUCCESS,
      data: {},
      message: "Delete Artist successfully",
    });
  }

  async findArtistById(id: string) {
    return await this.ArtistRepository.findOne({ where: { id } });
  }
}
