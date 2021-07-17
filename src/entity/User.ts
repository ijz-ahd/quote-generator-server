import {
  Entity,
  Column,
  BeforeInsert,
  OneToMany,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity,
} from "typeorm";
import { IsEmail, Length } from "class-validator";
import { classToPlain, Exclude } from "class-transformer";
import bcrypt from "bcrypt";
import Favorite from "./Favorites";

@Entity("users")
export default class User extends BaseEntity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

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

  toJSON() {
    return classToPlain(this);
  }
}
