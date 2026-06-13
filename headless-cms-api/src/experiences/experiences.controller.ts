import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { CreateExperienceSchema, type CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceSchema, type UpdateExperienceDto } from './dto/update-experience.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { QuerySchema } from '../common/dto/query.dto';
import type { QueryDto } from '../common/dto/query.dto';

@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Post()
  create(@Body(new ZodValidationPipe(CreateExperienceSchema)) dto: CreateExperienceDto) {
    return this.experiencesService.create(dto);
  }

  @Get()
  findAll(@Query(new ZodValidationPipe(QuerySchema)) query: QueryDto) {
    return this.experiencesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.experiencesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateExperienceSchema)) dto: UpdateExperienceDto,
  ) {
    return this.experiencesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.experiencesService.remove(id);
  }
}
