import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { calculateLoyaltyTier } from '../utils/loyalty.util.js';
import admin from '../config/firebase.config.js';
import { exists } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  // ================= CHECK PHONE =================
  async checkPhone(phone: string) {
    try {
      if (!phone || typeof phone !== 'string') {
        throw new BadRequestException('Phone number is required');
      }

      const normalizedPhone = phone.replace('+84', '0');
      
      // Validate phone format
      if (!/^0\d{9}$/.test(normalizedPhone)) {
        throw new BadRequestException('Invalid phone format');
      }

      const user = await this.prisma.user.findUnique({
        where: { phone: normalizedPhone },
      });
      return { exists: !!user };
    } catch (error: any) {
      // If already a BadRequestException, re-throw it
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      // Log database errors for debugging
      console.error('❌ checkPhone error:', error.message);
      
      // Return a safe error response
      throw new BadRequestException('Unable to verify phone number. Please try again.');
    }
  }

  // ================= LOGIN EMAIL =================
  async login(dto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await bcrypt.compare(dto.password, user.password);

    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        phone: user.phone,
        address: user.address,
        createdAt: user.createdAt,
        loyaltyPoint: user.loyaltyPoint,
        loyaltyTier: calculateLoyaltyTier(user.totalSpent),
        totalOrders: user.totalOrders,
        totalSpent: user.totalSpent,
      },
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refresh_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    };
  }

  // ================= REGISTER =================
  async register(dto: RegisterDto) {
    const existPhone = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });

    if (existPhone) {
      throw new BadRequestException('Phone already exists');
    }

    if (dto.email) {
      const existEmail = await this.prisma.user.findFirst({
        where: { email: dto.email },
      });

      if (existEmail) {
        throw new BadRequestException('Email already exists');
      }
    }

    const hash = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        email: dto.email ?? null,
        password: hash,
        name: dto.name,
        role: 'CUSTOMER',
        phone: dto.phone,
        address: dto.address ?? null,
      },
    });
  }

  // ================= CHANGE PASSWORD =================
  async changePassword(
    dto: { oldPassword: string; newPassword: string },
    userId: number,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('User not found');
    }

    const oldPasswordMatch = await bcrypt.compare(
      dto.oldPassword,
      user.password,
    );

    if (!oldPasswordMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const newPasswordHash = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: newPasswordHash },
    });

    return { message: 'Password changed successfully' };
  }

  async me(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return null;

    return {
      ...user,
      loyaltyTier: calculateLoyaltyTier(user.totalSpent),
    };
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    try {
      // Check if phone is already taken by another user 
      if (dto.phone) {
        const existingPhone = await this.prisma.user.findUnique({
          where:
            { phone: dto.phone },
        });
        if (existingPhone && existingPhone.id !== userId) {
          throw new BadRequestException('Phone already exists');
        }
      }
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...(dto.name && { name: dto.name }),
          ...(dto.phone && { phone: dto.phone }),
          ...(dto.address && { address: dto.address }),
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          address: true,
          createdAt: true,
          loyaltyPoint: true,
          totalOrders: true,
          totalSpent: true,
        },
      });
      return {
        ...updatedUser,
        loyaltyTier: calculateLoyaltyTier(updatedUser.totalSpent),
      };
    }
    catch (error: any) {
      if (error.code === 'P2002') {
        const field = error.meta.target[0];
        throw new BadRequestException(`${field} already exists`);
      }
      throw error;
    }
  }
  async refresh(token: string) {
    try {
      const payload = this.jwtService.verify(
        token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const newAccessToken = this.jwtService.sign({
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      });
      return { access_token: newAccessToken };
    }
    catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  // ================= FIREBASE LOGIN =================
  async firebaseLogin(idToken: string, profile?: any) {
  const decoded = await admin.auth().verifyIdToken(idToken);

  const phone = decoded.phone_number;

  if (!phone) {
    throw new UnauthorizedException('No phone number in token');
  }

  const normalizedPhone = phone.replace('+84', '0');

  console.log('📞 Firebase phone:', normalizedPhone);
  console.log('🧾 Profile from client:', profile);

  let user = await this.prisma.user.findUnique({
    where: { phone: normalizedPhone },
  });

  // ======================
  // CREATE USER
  // ======================
  if (!user) {
    user = await this.prisma.user.create({
      data: {
        phone: normalizedPhone,
        phoneVerified: true,

        // 🔥 lấy từ Firebase + client
        name: profile?.fullName || 'User',
        email: profile?.email || null,
        address: profile?.address || null,

        role: 'CUSTOMER',
      },
    });

    console.log('🆕 Created user:', user.id);
  } else {
    console.log('👤 Existing user:', user.id);

    // optional: update missing fields
    user = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email || profile?.email || null,
        name: user.name || profile?.fullName || 'User',
        address: user.address || profile?.address || null,
      },
    });
  }

  const payload = {
    sub: user.id,
    phone: user.phone,
    role: user.role,
  };

  return {
    user,
    access_token: this.jwtService.sign(payload),
  };
}
}