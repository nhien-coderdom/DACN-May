import { Module } from '@nestjs/common';
import { PersonalizationController } from './personalization.controller.js';
import { PersonalizationService } from './personalization.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [PersonalizationController],
  providers: [PersonalizationService],
})
export class PersonalizationModule {}