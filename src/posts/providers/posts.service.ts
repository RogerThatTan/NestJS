import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDTO } from '../DTOs/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
@Injectable()
export class PostsService {
  constructor(
    /*
     * Injecting Users Service
     */
    private readonly usersService: UsersService,

    /**
     * Injecting postsRepository
     */
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    /**
     * Inject metaOptionsRepository
     */
    @InjectRepository(MetaOption)
    public readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  /**
   * Method to create a new post
   */
  public async create(@Body() createPostDto: CreatePostDTO) {
    //Find author from database based on authorId

    let author = await this.usersService.findOneById(createPostDto.authorId);

    // Create the post
    let post = this.postsRepository.create({
      ...createPostDto,
      author: author || undefined,
    });

    //return the post
    return await this.postsRepository.save(post);
  }

  public async findAll(userId: string) {
    //users service

    let posts = await this.postsRepository.find({
      relations: {
        metaOptions: true,
        // author: true,
      },
    });
    return posts;
  }

  public async delete(id: number) {
    //find the post by id
    let post = await this.postsRepository.findOneBy({ id });

    await this.postsRepository.delete(id);

    //confirm the deletion
    return { deleted: true, id };
  }
}
