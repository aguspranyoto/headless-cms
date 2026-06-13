import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostSchema } from './dto/create-post.dto';
import { UpdatePostSchema } from './dto/update-post.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { QuerySchema } from '../common/dto/query.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(CreatePostSchema)) body: any,
  ) {
    return this.postsService.create(body);
  }

  @Get()
  async findAll(
    @Query(new ZodValidationPipe(QuerySchema)) query: any,
  ) {
    return this.postsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdatePostSchema)) body: any,
  ) {
    return this.postsService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
