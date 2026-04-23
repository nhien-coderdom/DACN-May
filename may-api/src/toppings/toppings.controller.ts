// nơi nhận request từ client
//định nghĩa API (GET, POST, PATCH, DELETE)
//gọi service -> trả kết quả về
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ToppingsService } from './toppings.service.js';
import { CreateToppingDto } from './dto/create-toppings.dto.js';
import { UpdateToppingDto } from './dto/update-toppings.dto.js';
@Controller('toppings') // base URL
export class ToppingsController {
  constructor(private toppingsService: ToppingsService) {}

  // 🔥 Admin routes (phải đứng trước :id routes)
  @Get('admin/list')
  findAllAdmin() {
    return this.toppingsService.findAllAdmin();
  }

  @Get('admin/:id')
  findOneAdmin(@Param('id') id: string) {
    return this.toppingsService.findOneAdmin(Number(id));
  }

  // 👥 User routes
  @Get()
  findAll() {
    return this.toppingsService.findAll();
  }
  // param lấy từ url
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toppingsService.findOne(Number(id));
  }

  @Post()
  create(@Body() data: CreateToppingDto) {
    return this.toppingsService.create(data);
  }

  // toggle active
  @Patch(':id/toggle-active')
  toggleActive(@Param('id') id: string) {
    return this.toppingsService.toggleActive(Number(id));
  }

  // update
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateToppingDto) {
    return this.toppingsService.update(Number(id), data);
  }

  // delete
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.toppingsService.delete(Number(id));
  }
}
