import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { FAVORITE_MODEL, Favorite } from "./entity/favorite.entity";
import { EntityManager, Repository } from "typeorm";
import { AlbumService } from "../album/album.service";
import { TrackService } from "../track/track.service";
import { ArtistService } from "../artist/artist.service";
import { UserService } from "../user/user.service";
import { ReturnCommon } from "src/common/utilities/base-response";
import { EResponse } from "src/common/interface.common";
import { FAVORITE_TYPE } from "./favorite.constant";
import { TRACK_MODEL } from "../track/entity/track.entity";
import { PERSON_MODEL } from "../user/entity/person.entity";
import { ALBUM_MODEL } from "../album/entity/album.entity";
import { ARTIST_MODEL } from "../artist/entity/artist.entity";

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private readonly FavoriteRepository: Repository<Favorite>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
    private readonly artistService: ArtistService,
    private readonly userService: UserService
  ) {}

  async getAllFavByUser(userId: string) {
    const queryAlbum = `
    SELECT A.ID , A.NAME ,A.YEAR, A.CREATED_BY FROM  ALBUMS A INNER JOIN 
    ( SELECT F.ALBUM_ID FROM FAVORITES F WHERE F.CREATED_BY = '${userId}' and F.TYPE = '${FAVORITE_TYPE.ALBUM}' ) AS FAV
    ON A.ID = FAV.ALBUM_ID
`;
    const queryTrack = `
    SELECT T.ID , T.NAME ,T.DURATION, T.CREATED_BY FROM  TRACKS T INNER JOIN 
    ( SELECT F.TRACK_ID FROM FAVORITES F WHERE F.CREATED_BY = '${userId}' and F.TYPE = '${FAVORITE_TYPE.TRACK}' ) AS FAV
    ON T.ID = FAV.TRACK_ID
    `;
    const queryArtist = `
    SELECT A.ID , A.NAME ,A.GRAMMY, A.CREATED_BY FROM  ARTIST A INNER JOIN 
    ( SELECT F.ARTIST_ID FROM FAVORITES F WHERE F.CREATED_BY = '${userId}' and F.TYPE = '${FAVORITE_TYPE.ARTIST}' ) AS FAV
    ON A.ID = FAV.ARTIST_ID
    `;
    const tracks = await this.entityManager.query(queryTrack);

    const albums = await this.entityManager.query(queryAlbum);

    const artists = await this.entityManager.query(queryArtist);
    
    return ReturnCommon({
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
      data: { tracks, albums, artists },
      message: "Get favorite successfully",
    });
  }

  async createFavTrack({
    trackId,
    userId,
  }: {
    trackId: string;
    userId: string;
  }) {
    const trackFound = await this.trackService.findTrackById(trackId);
    if (!trackFound) {
      throw new UnprocessableEntityException("Track not found");
    }

    //check existed fav

    const favTrackExisted = await this.entityManager
      .getRepository(Favorite)
      .createQueryBuilder(FAVORITE_MODEL)
      .leftJoinAndSelect("favorites.track", TRACK_MODEL)
      .where(
        "favorites.created_by = :userId AND favorites.track_id = :trackId",
        { userId, trackId }
      )
      .getOne();

    if (favTrackExisted) {
      return ReturnCommon({
        statusCode: HttpStatus.CREATED,
        status: EResponse.SUCCESS,
        data: { favTrack: favTrackExisted },
        message: "Fav track successfully",
      });
    }

    const user = await this.userService.findUserById(userId);
    const newFav = this.FavoriteRepository.create({
      track: trackFound,
      person: user,
      type: FAVORITE_TYPE.TRACK,
    });
    const toSaveTrack = await this.FavoriteRepository.save(newFav);

    return ReturnCommon({
      statusCode: HttpStatus.CREATED,
      status: EResponse.SUCCESS,
      data: { favTrack: toSaveTrack },
      message: "Fav track successfully",
    });
  }

  async deleteFavTrack({
    trackId,
    userId,
  }: {
    trackId: string;
    userId: string;
  }) {
    const favFound = await this.entityManager
      .getRepository(Favorite)
      .createQueryBuilder(FAVORITE_MODEL)
      .leftJoinAndSelect("favorites.person", PERSON_MODEL)
      .where("favorites.track_id = :trackId", { userId, trackId })
      .getOne();

    if (!favFound) {
      throw new NotFoundException("Track not favorite");
    }
    if (favFound.person?.id !== userId) {
      throw new BadRequestException("Permission failed");
    }
    await this.FavoriteRepository.delete({ id: favFound.id });

    return ReturnCommon({
      statusCode: HttpStatus.NO_CONTENT,
      status: EResponse.SUCCESS,
      data: {},
      message: "Delete favorite track successfully ",
    });
  }

  async createFavAlbum({
    albumId,
    userId,
  }: {
    albumId: string;
    userId: string;
  }) {
    const albumFound = await this.albumService.findAlbumById(albumId);
    if (!albumFound) {
      throw new UnprocessableEntityException("Album not found");
    }

    //check existed fav

    const favAlbumExisted = await this.entityManager
      .getRepository(Favorite)
      .createQueryBuilder(FAVORITE_MODEL)
      .leftJoinAndSelect("favorites.album", ALBUM_MODEL)
      .where(
        "favorites.created_by = :userId AND favorites.album_id = :albumId",
        { userId, albumId }
      )
      .getOne();

    if (favAlbumExisted) {
      return ReturnCommon({
        statusCode: HttpStatus.CREATED,
        status: EResponse.SUCCESS,
        data: { favAlbum: favAlbumExisted },
        message: "Fav album successfully",
      });
    }

    const user = await this.userService.findUserById(userId);
    const newFav = this.FavoriteRepository.create({
      album: albumFound,
      person: user,
      type: FAVORITE_TYPE.ALBUM,
    });
    const toSaveFav = await this.FavoriteRepository.save(newFav);

    return ReturnCommon({
      statusCode: HttpStatus.CREATED,
      status: EResponse.SUCCESS,
      data: { favAlbum: toSaveFav },
      message: "Fav Album successfully",
    });
  }

  async deleteFavAlbum({
    albumId,
    userId,
  }: {
    albumId: string;
    userId: string;
  }) {
    const favFound = await this.entityManager
      .getRepository(Favorite)
      .createQueryBuilder(FAVORITE_MODEL)
      .leftJoinAndSelect("favorites.person", PERSON_MODEL)
      .where("favorites.album_id = :albumId", { userId, albumId })
      .getOne();

    if (!favFound) {
      throw new NotFoundException("Album not favorite");
    }
    if (favFound.person?.id !== userId) {
      throw new BadRequestException("Permission failed");
    }
    await this.FavoriteRepository.delete({ id: favFound.id });

    return ReturnCommon({
      statusCode: HttpStatus.NO_CONTENT,
      status: EResponse.SUCCESS,
      data: {},
      message: "Delete favorite album successfully ",
    });
  }

  async createFavArtist({
    artistId,
    userId,
  }: {
    artistId: string;
    userId: string;
  }) {
    const artistFound = await this.artistService.findArtistById(artistId);
    if (!artistFound) {
      throw new UnprocessableEntityException("Artist not found");
    }

    //check existed fav

    const favArtistExisted = await this.entityManager
      .getRepository(Favorite)
      .createQueryBuilder(FAVORITE_MODEL)
      .leftJoinAndSelect("favorites.artist", ARTIST_MODEL)
      .where(
        "favorites.created_by = :userId AND favorites.artist_id = :artistId",
        { userId, artistId }
      )
      .getOne();

    if (favArtistExisted) {
      return ReturnCommon({
        statusCode: HttpStatus.CREATED,
        status: EResponse.SUCCESS,
        data: { favArtist: favArtistExisted },
        message: "Fav artist successfully",
      });
    }

    const user = await this.userService.findUserById(userId);
    const newFav = this.FavoriteRepository.create({
      artist: artistFound,
      person: user,
      type: FAVORITE_TYPE.ARTIST,
    });
    const toSaveFav = await this.FavoriteRepository.save(newFav);

    return ReturnCommon({
      statusCode: HttpStatus.CREATED,
      status: EResponse.SUCCESS,
      data: { favAlbum: toSaveFav },
      message: "Fav Artist successfully",
    });
  }

  async deleteFavArtist({
    artistId,
    userId,
  }: {
    artistId: string;
    userId: string;
  }) {
    const favFound = await this.entityManager
      .getRepository(Favorite)
      .createQueryBuilder(FAVORITE_MODEL)
      .leftJoinAndSelect("favorites.person", PERSON_MODEL)
      .where("favorites.artist_id = :artistId", { userId, artistId })
      .getOne();

    if (!favFound) {
      throw new NotFoundException("Artist not favorite");
    }
    if (favFound.person?.id !== userId) {
      throw new BadRequestException("Permission failed");
    }
    await this.FavoriteRepository.delete({ id: favFound.id });

    return ReturnCommon({
      statusCode: HttpStatus.NO_CONTENT,
      status: EResponse.SUCCESS,
      data: {},
      message: "Delete favorite Artist successfully ",
    });
  }
}
