import { Min, MinLength } from "class-validator";
import { Album } from "src/modules/album/entity/album.entity";
import { Artist } from "src/modules/artist/entity/artist.entity";
import { Person } from "src/modules/user/entity/person.entity";
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";

export const TRACK_MODEL = "tracks";

@Entity(TRACK_MODEL)
export class Track {
  @PrimaryColumn({ type: "uuid" })
  @Generated("uuid")
  id: string;

  @Column({ nullable: false })
  @MinLength(1)
  name: string;

  // nguoi tao
  @ManyToOne(() => Person, (person) => person.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "created_by" })
  person: Person;

  @ManyToOne(() => Artist, (artist) => artist.id, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "artist_id" })
  artist: Artist | null;

  @ManyToOne(() => Album, (album) => album.id, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "album_id" })
  album: Album | null;

  @Column({ nullable: false })
  @Min(1)
  duration: number;

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date;
}
