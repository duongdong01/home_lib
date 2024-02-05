import { MinLength } from "class-validator";
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  Generated,
  OneToMany,
} from "typeorm";
import { USER_ROLE } from "../user.constant";
import { Artist } from "src/modules/artist/entity/artist.entity";

export const PERSON_MODEL = "persons";

@Entity(PERSON_MODEL)
export class Person {
  @PrimaryColumn({ type: "uuid" })
  @Generated("uuid")
  id: string;

  @Column({ nullable: false })
  @MinLength(1)
  login: string;

  @Column({ nullable: false, select: false })
  @MinLength(6)
  password: string;

  @Column({ default: 0 })
  version: number;

  @Column({ nullable: false, default: USER_ROLE.USER, enum: USER_ROLE })
  role: string;

  @OneToMany(() => Artist, (photo) => photo.person)
  artists: Artist[];

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date;
}
