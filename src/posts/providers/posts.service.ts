import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDTO } from '../DTOs/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDTO } from '../DTOs/patch-post.dto';
import { Tag } from 'src/tags/tag.entity';
@Injectable()
export class PostsService {
  constructor(
    /**
     * Injecting Users Service and Tag Service
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

    private readonly tagsService: TagsService,
  ) {}

  /**
   * Method to create a new post
   */
  public async create(@Body() createPostDto: CreatePostDTO) {
    //Find author from database based on authorId

    let author = await this.usersService.findOneById(createPostDto.authorId);

    //Find Tags
    let tags = await this.tagsService.findMultipleTags(
      createPostDto.tags || [],
    );

    // Create the post
    let post = this.postsRepository.create({
      ...createPostDto,
      author: author || undefined,
      tags: tags,
    });

    //return the post
    return await this.postsRepository.save(post);
  }

  public async findAll(userId: string) {
    //users service

    let posts = await this.postsRepository.find({
      relations: {
        metaOptions: true,
        //tags: true,
        // author: true,
      },
    });
    return posts;
  }

  public async update(patchPostDto: PatchPostDTO) {
    let tags: Tag[] | undefined = undefined;
    let post: Post | undefined = undefined;
    //Find the tags from the database
    try {
      tags = await this.tagsService.findMultipleTags(patchPostDto.tags || []);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to find the tags from the database',
      );
    }
    /**
     * Number of tags need to be equal
     */
    if (!tags || tags.length !== (patchPostDto.tags ?? []).length) {
      throw new BadRequestException(
        'Please check your tag Ids and ensure they are correct',
      );
    }

    //Find the post
    try {
      post =
        (await this.postsRepository.findOneBy({
          id: patchPostDto.id,
        })) || undefined;
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to find the tags from the database',
      );
    }
    //Update the properties
    if (!post) {
      throw new BadRequestException(
        `Post with ID ${patchPostDto.id} not found`,
      );
    }
    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;

    // Assign the new tags
    post.tags = tags;

    // Save the post and return it
    try {
      await this.postsRepository.save(post);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to save the post to the database',
      );
    }
    return post;
  }

  public async delete(id: number) {
    //find the post by id
    let post = await this.postsRepository.findOneBy({ id });

    await this.postsRepository.delete(id);

    //confirm the deletion
    return { deleted: true, id };
  }
}
