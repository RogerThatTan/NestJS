import { Body, Controller, Post } from '@nestjs/common';
import { CreateTagDTO } from './DTOs/create-tag.dto';
import { TagsService } from './providers/tags.service';

@Controller('tags')
export class TagsController {
  constructor(
    /**
     * Inject TagService
     */
    private readonly tagsService: TagsService,
  ) {}
  @Post()
  public create(@Body() createTagDto: CreateTagDTO) {
    return this.tagsService.create(createTagDto);
  }
}
