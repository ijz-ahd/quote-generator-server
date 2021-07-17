import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import BaseModel from "./BaseModel";
import User from "./User";

@Entity("favorites")
export default class Favorite extends BaseModel {
  constructor(favorite: Partial<Favorite>) {
    super();
    Object.assign(this, favorite);
  }

  @ManyToOne(() => User, (user) => user.favorites)
  user: User;

  @Column()
  title: string;

  @Column()
  author: string;
}
