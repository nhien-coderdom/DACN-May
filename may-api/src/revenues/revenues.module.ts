import { Module } from '@nestjs/common'
import { RevenuesController } from './revenues.controller.js'
import { RevenuesService } from './revenues.service.js'
import { OrderStatsService } from './order-stats.service.js'
import { PrismaModule } from '../prisma/prisma.module.js'

@Module({
  imports: [PrismaModule],
  controllers: [RevenuesController],
  providers: [RevenuesService, OrderStatsService],
  exports: [RevenuesService, OrderStatsService],
})
export class RevenuesModule {}
