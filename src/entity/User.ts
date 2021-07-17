import { Entity, Column, BeforeInsert, OneToMany } from "typeorm";
import { IsEmail, Length } from "class-validator";
import { Exclude } from "class-transformer";
import bcrypt = require("bcrypt");
import BaseModel from "./BaseModel";
import Favorite from "./Favorites";

@Entity("users")
export default class User extends BaseModel {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Column()
  @Length(3)
  username: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }
}
