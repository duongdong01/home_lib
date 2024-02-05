import { MinLength } from "class-validator";
import { Person } from "src/modules/user/entity/person.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

export const ARTIST_MODEL = "artist";

@Entity(ARTIST_MODEL)
export class Artist {
  @PrimaryColumn({ type: "uuid" })
  @Generated("uuid")
  id: string;

  @Column({ nullable: false })
  @MinLength(1)
  name: string;

  @Column({ nullable: false })
  grammy: boolean;

  // nguoi tao
  @ManyToOne(() => Person, (person) => person.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "created_by" })
  person: Person;

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date;
}
