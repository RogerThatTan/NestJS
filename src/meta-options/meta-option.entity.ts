import { Post } from 'src/posts/post.entity';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class MetaOption {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'json',
    nullable: false,
  })
  metaValue: string;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  //creatinf Bi-directional relationship with post entity

  @OneToOne(() => Post, (post) => post.metaOptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  post: Post;
}
