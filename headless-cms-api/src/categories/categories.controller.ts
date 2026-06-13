import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategorySchema } from './dto/create-category.dto';
import { UpdateCategorySchema } from './dto/update-category.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { QuerySchema } from '../common/dto/query.dto';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateCategorySchema)) body: any,
  ) {
    return this.categoriesService.create(body);
  }

  @Get()
  async findAll(
    @Query(new ZodValidationPipe(QuerySchema)) query: any,
  ) {
    return this.categoriesService.findAll(query);
  }

  @Get('tree')
  async findTree() {
    return this.categoriesService.findAllTree();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateCategorySchema)) body: any,
  ) {
    return this.categoriesService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
