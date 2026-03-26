import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common'
import { AuthService } from './auth.service.js'
import { LoginDto } from './dto/login.dto.js'
import { RegisterDto } from './dto/register.dto.js'
import { ChangePasswordDto } from './dto/changePassword.dto.js'
import { JwtAuthGuard } from './guards/jwt-auth.guard.js'

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
}

@Post("change-password")
changePassword(@Body() dto: ChangePasswordDto, @Req() req: any) {
  return this.authService.changePassword(dto, req.user.id)
}


@Post("logout")
@UseGuards(JwtAuthGuard)
logout() {
  return { message: "Logged out successfully" }
}

@Post("refresh")
refresh(@Body("refreshToken") token: string) {
  return this.authService.refresh(token)
}

}