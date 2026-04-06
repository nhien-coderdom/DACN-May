import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '@prisma/client';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // STT Thống kê nhanh
  @Get('stats')
  async getQuickStats() {
    return this.dashboardService.getQuickStats();
  }

  // STT Doanh thu theo ngày
  @Get('revenue')
  async getRevenue(@Query('days') days: string = '30') {
    return this.dashboardService.getRevenueByDate(parseInt(days));
  }

  // STT Đơn hàng theo ngày
  @Get('orders-chart')
  async getOrdersChart(@Query('days') days: string = '30') {
    return this.dashboardService.getOrdersByDate(parseInt(days));
  }

  // STT Top sản phẩm
  @Get('top-products')
  async getTopProducts(@Query('limit') limit: string = '10') {
    return this.dashboardService.getTopProducts(parseInt(limit));
  }

  // STT Top khách hàng
  @Get('top-customers')
  async getTopCustomers(@Query('limit') limit: string = '10') {
    return this.dashboardService.getTopCustomers(parseInt(limit));
  }

  // STT Đơn hàng mới
  @Get('recent-orders')
  async getRecentOrders(@Query('limit') limit: string = '10') {
    return this.dashboardService.getRecentOrders(parseInt(limit));
  }

  // STT Người dùng mới
  @Get('recent-users')
  async getRecentUsers(@Query('limit') limit: string = '10') {
    return this.dashboardService.getRecentUsers(parseInt(limit));
  }
}
