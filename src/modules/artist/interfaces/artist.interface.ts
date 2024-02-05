import { IPerson } from "src/modules/user/interfaces/person.interface";

export interface IArtist {
  id: string;
  name: string;
  grammy: boolean;
  person: IPerson;
  created_at: Date;
  updated_at: Date;
}
