import { Module } from '@nestjs/common';
import { ToppingsController } from './toppings.controller.js';
import { ToppingsService } from './toppings.service.js';
import { PrismaModule } from '../prisma/prisma.module.js'
@Module({
  controllers: [ToppingsController],
  providers: [ToppingsService],
  imports: [PrismaModule]
})
export class ToppingsModule {}
