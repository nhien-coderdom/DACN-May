import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common'
import { CategoriesService } from './categories.service.js'

@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  // POST /categories
  @Post()
  create(@Body() body: { name: string; parentId?: number }) {
    return this.service.create(body.name, body.parentId)
  }

  // GET /categories/menu
  @Get('menu')
  findMenu() {
    return this.service.findMenu()
  }

  // GET /categories/1/children
  @Get(':id/children')
  findChildren(@Param('id') id: string) {
    return this.service.findChildren(Number(id))
  }

  // PATCH /categories/1
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(Number(id), body)
  }

  // DELETE /categories/1
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id))
  }
}
