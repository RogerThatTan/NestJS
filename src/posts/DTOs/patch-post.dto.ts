import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { CreatePostDTO } from './create-post.dto';

export class PatchPostDTO extends PartialType(CreatePostDTO) {
  @ApiProperty({
    description: 'The ID of the post that needs to be updated',
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
