import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity,
} from "typeorm";
import User from "./User";

@Entity("favorites")
export default class Favorite extends BaseEntity {
  constructor(favorite: Partial<Favorite>) {
    super();
    Object.assign(this, favorite);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.favorites)
  user: User;

  @Column()
  title: string;

  @Column()
  author: string;
}
