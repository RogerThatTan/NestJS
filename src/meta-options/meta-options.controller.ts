import { Body, Controller, Post } from '@nestjs/common';
import { CreatePostMetaOptionsDTO } from './DTOs/create-post-meta-options.dto';
import { MetaOptionsService } from './providers/meta-options.service';

@Controller('meta-options')
export class MetaOptionsController {
  constructor(
    /**
     * Inject MetaOptionsService
     */
    private readonly metaOptionsService: MetaOptionsService,
  ) {}
  @Post()
  public create(@Body() createPostMetaOptionsDto: CreatePostMetaOptionsDTO) {
    return this.metaOptionsService.create(createPostMetaOptionsDto);
  }
}
