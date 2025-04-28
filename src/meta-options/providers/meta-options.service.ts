import { Injectable } from '@nestjs/common';
import { CreatePostMetaOptionsDTO } from '../DTOs/create-post-meta-options.dto';
import { Repository } from 'typeorm';
import { MetaOption } from '../meta-option.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MetaOptionsService {
  constructor(
    //Inject MetaOptionsRepository
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  public async create(createPostMetaOptionsDto: CreatePostMetaOptionsDTO) {
    let metaOption = this.metaOptionsRepository.create(
      createPostMetaOptionsDto,
    );
    return await this.metaOptionsRepository.save(metaOption);
  }
}
