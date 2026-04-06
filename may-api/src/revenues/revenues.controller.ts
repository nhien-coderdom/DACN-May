import { Controller, Get, Query } from '@nestjs/common'
import { RevenuesService } from './revenues.service.js'
import { OrderStatsService } from './order-stats.service.js'

@Controller('revenues')
export class RevenuesController {
  constructor(
    private readonly revenuesService: RevenuesService,
    private readonly orderStatsService: OrderStatsService,
  ) {}

  /**
   * Get revenue data for specified date range
   * @param range - Date range: '7days', '30days', '90days', '1year'
   * @param startDate - Start date for custom range (YYYY-MM-DD)
   * @param endDate - End date for custom range (YYYY-MM-DD)
   * @returns Revenue data with total and chart data grouped by date
   */
  @Get()
  async getRevenue(
    @Query('range') range: string = '7days',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.revenuesService.getRevenue(range, startDate, endDate)
  }

  /**
   * Get order statistics for specified date range
   * @param range - Date range: '7days', '30days', '90days', '1year'
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   * @returns Order stats with counts and percentages by status
   */
  @Get('order-stats')
  async getOrderStats(
    @Query('range') range: string = '7days',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.orderStatsService.getOrderStats(range, startDate, endDate)
  }
}
