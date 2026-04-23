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
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body(ValidationPipe) body: CreateProductDto) {
    return this.productsService.create(body);
  }

  // � Admin routes (phải đứng trước :id routes)
  @Get('admin/list')
  findAllAdmin() {
    return this.productsService.findAllAdmin();
  }

  @Get('admin/:id')
  findOneAdmin(@Param('id') id: string) {
    return this.productsService.findOneAdmin(Number(id));
  }

  // 👥 User routes
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('best-selling')
  getBestSelling() {
    return this.productsService.getBestSellingProducts();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(Number(id));
  }

  @Patch(':id/toggle-active')
  toggleActive(@Param('id') id: string) {
    return this.productsService.toggleActive(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) body: UpdateProductDto,
  ) {
    return this.productsService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(Number(id));
  }
}
