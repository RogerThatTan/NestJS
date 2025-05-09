import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDTO } from './DTOs/create-post.dto';
import { PatchPostDTO } from './DTOs/patch-post.dto';
import { GetPostsDto } from './DTOs/get-posts.dto';
@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('/:userId')
  public getPosts(
    @Param('userId') userId: string,
    @Query() postQuery: GetPostsDto,
  ) {
    console.log(postQuery);
    return this.postsService.findAll(postQuery, userId);
  }

  @ApiOperation({
    summary: 'Creates a new blog post',
  })
  @ApiResponse({
    status: 201,
    description: 'You get a 201 response if your post is created succeffully',
  })
  @Post()
  public createPost(@Body() createPostDto: CreatePostDTO) {
    return this.postsService.create(createPostDto);
  }

  @ApiOperation({
    summary: 'Updates an exisiting blog post',
  })
  @ApiResponse({
    status: 200,
    description: 'A 200 response if the post is updated successfully',
  })
  @Patch()
  public updatePost(@Body() patchPostsDto: PatchPostDTO) {
    return this.postsService.update(patchPostsDto);
  }

  @Delete()
  public deletePost(@Query('id', ParseIntPipe) id: number) {
    return this.postsService.delete(id);
  }
}
