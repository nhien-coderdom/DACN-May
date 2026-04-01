import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service.js"
import * as bcrypt from "bcrypt"
import { JwtService } from "@nestjs/jwt"
import { RegisterDto } from "./dto/register.dto.js";

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

    // if (user.role === "CUSTOMER") {
    //   throw new UnauthorizedException("Access denied")
    // }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    }

    const accessToken = this.jwtService.sign(payload, {
  expiresIn: "15m",
})

const refreshToken = this.jwtService.sign(payload, {
  secret: process.env.JWT_REFRESH_SECRET,
  expiresIn: "7d",
})

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      access_token: accessToken,
      refresh_token: refreshToken,
    }
  }

  async register(dto: RegisterDto) {
    const exist = await this.prisma.user.findUnique({
      where: { email: dto.email }
})

    if (exist) {
      throw new UnauthorizedException("Email already exists")
}

  const hash = await bcrypt.hash(dto.password, 10)

  const user = await this.prisma.user.create({
    data: {
      email: dto.email,
      password: hash,
      name: dto.name,
      role: "CUSTOMER",
      phone: dto.phone,
    }
  })

  return user
}

async changePassword(dto: { oldPassword: string; newPassword: string }, userId: number) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new UnauthorizedException("User not found")
  }

  const oldPasswordMatch = await bcrypt.compare(dto.oldPassword, user.password)

  if (!oldPasswordMatch) {
    throw new UnauthorizedException("Current password is incorrect")
  }

  const newPasswordHash = await bcrypt.hash(dto.newPassword, 10)

  await this.prisma.user.update({
    where: { id: userId },
    data: { password: newPasswordHash }
  })

  return { message: "Password changed successfully" }

}

async logout() {
  // For JWT, logout is handled on the client side by deleting the token.
  // Optionally, you can implement token blacklisting on the server side if needed.
  
  return { message: "Logged out successfully" }
}

async me(userId: number) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true
    }
  })
  return user;
}

async refresh(token: string) {
  try {
    const payload = this.jwtService.verify(token, {
      secret: process.env.JWT_REFRESH_SECRET,
    })

    const newAccessToken = this.jwtService.sign({
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    })

    return { access_token: newAccessToken }

  } catch {
    throw new UnauthorizedException("Invalid refresh token")
  }
}
}