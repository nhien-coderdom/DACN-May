import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service.js"
import * as bcrypt from "bcrypt"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async login(dto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })

    if (!user) throw new UnauthorizedException("Invalid credentials")

    const match = await bcrypt.compare(dto.password, user.password)

    if (!match) throw new UnauthorizedException("Invalid credentials")

    if (user.role === "CUSTOMER") {
      throw new UnauthorizedException("Access denied")
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    }

    const token = await this.jwtService.signAsync(payload)

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    }
  }
}