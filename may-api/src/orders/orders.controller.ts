import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common'
import { OrderStatus } from '@prisma/client'
import { OrdersService } from './orders.service.js'
import { CreateOrderDto } from './dto/create-orders.dto.js'
import { UpdateOrderDto } from './dto/update-order.dto.js'

@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Get()
  findAll() {
    return this.service.findAll()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.service.create(dto)
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderDto,
  ) {
    if (!dto.status) {
      throw new BadRequestException('status is required')
    }
    return this.service.updateStatus(id, dto.status)
  }

  @Patch(':id/info')
  updateInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderDto,
  ) {
    return this.service.updateInfo(id, dto)
  }

  @Patch(':id/cancel')
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.service.updateStatus(id, OrderStatus.CANCELLED)
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id)
  }
}