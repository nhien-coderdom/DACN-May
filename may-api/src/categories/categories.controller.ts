import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(
    @Body(ValidationPipe)
    body: CreateCategoryDto,
  ) {
    return this.categoriesService.create(body);
  }

  // � Admin routes (phải đứng trước :id routes)
  @Get('admin/list')
  findAllAdmin() {
    return this.categoriesService.findAllAdmin();
  }

  @Get('admin/:id')
  findOneAdmin(@Param('id') id: string) {
    return this.categoriesService.findOneAdmin(Number(id));
  }

  // 👥 User routes
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(Number(id));
  }

  @Patch(':id/toggle-active')
  toggleActive(@Param('id') id: string) {
    return this.categoriesService.toggleActive(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe)
    body: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(Number(id));
  }
}
