import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectSchema } from './dto/create-project.dto';
import { UpdateProjectSchema } from './dto/update-project.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { QuerySchema } from '../common/dto/query.dto';
import type { QueryDto } from '../common/dto/query.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body(new ZodValidationPipe(CreateProjectSchema)) dto: any) {
    return this.projectsService.create(dto);
  }

  @Get()
  findAll(@Query(new ZodValidationPipe(QuerySchema)) query: QueryDto) {
    return this.projectsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateProjectSchema)) dto: any,
  ) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
