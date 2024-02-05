import { MinLength } from "class-validator";
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  Generated,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Artist } from "src/modules/artist/entity/artist.entity";
import { Person } from "src/modules/user/entity/person.entity";
import { Album } from "src/modules/album/entity/album.entity";
import { Track } from "src/modules/track/entity/track.entity";
import { FAVORITE_TYPE } from "../favorite.constant";

export const FAVORITE_MODEL = "favorites";

@Entity(FAVORITE_MODEL)
export class Favorite {
  @PrimaryColumn({ type: "uuid" })
  @Generated("uuid")
  id: string;

  @Column({ nullable: false, enum: FAVORITE_TYPE })
  type: string;
  
  // nguoi tao
  @ManyToOne(() => Person, (person) => person.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "created_by" })
  person: Person;

  @ManyToOne(() => Artist, (artist) => artist.id, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "artist_id" })
  artist: Artist | null;

  @ManyToOne(() => Album, (album) => album.id, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "album_id" })
  album: Album | null;

  @ManyToOne(() => Track, (track) => track.id, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "track_id" })
  track: Track | null;

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date;
}
