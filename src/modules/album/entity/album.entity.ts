import { MinLength } from "class-validator";
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

export const ALBUM_MODEL = "albums";

@Entity(ALBUM_MODEL)
export class Album {
  @PrimaryColumn({ type: "uuid" })
  @Generated("uuid")
  id: string;

  @Column({ nullable: false })
  @MinLength(1)
  name: string;

  @Column({ nullable: false })
  year: number;

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

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date;
}
