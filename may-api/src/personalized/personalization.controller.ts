import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PersonalizedResponseDto } from './dto/personalized-response.dto.js';
import { Get, Req } from '@nestjs/common/decorators/http/index.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Controller, UseGuards } from '@nestjs/common/decorators/core/index.js';
import { PersonalizationService } from './personalization.service.js';

@ApiTags('Personalization')
@ApiBearerAuth()
@Controller('users/me')
export class PersonalizationController {
  constructor(private personalizationService: PersonalizationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('personalized')
  @ApiOkResponse({
    type: PersonalizedResponseDto,
    description: 'Lấy danh sách sản phẩm cá nhân hóa cho người dùng hiện tại',
  })
  async getPersonalized(@   Req() req: any): Promise<PersonalizedResponseDto> {
    return this.personalizationService.getPersonalizedData(req.user.id);
  }
}