import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/createUser.dto.js';
import bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/updateUserProfile.dto.js';
import { UserRole } from '@prisma/client';
import { UpdateUserRoleDto } from './dto/updateUserRole.dto.js';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService
  ) { }
  async findAll(showDeleted: boolean = false) {
    const users = await this.prisma.user.findMany({
      where: showDeleted ? { isDeleted: true } : { isDeleted: false },
    });
    return users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      address: user.address,
      role: user.role,
      loyaltyPoint: user.loyaltyPoint,
      totalOrders: user.totalOrders,
      totalSpent: user.totalSpent,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isDeleted: user.isDeleted,
      deletedAt: user.deletedAt,
    }));
  }

  async getMyProfile(userId: number) {

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        loyaltyPoint: true,
        totalOrders: true,
        totalSpent: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async getProfile(userId: number) {


    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        loyaltyPoint: true,
        totalOrders: true,
        totalSpent: true,
        createdAt: true,
      }
    })

    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async create(dto: CreateUserDto) {
    // Check email exists
    const existEmail = await this.prisma.user.findUnique({
      where: { email: dto.email }
    })

    if (existEmail) {
      throw new BadRequestException("Email already exists")
    }

    // Check phone exists
    const existPhone = await this.prisma.user.findUnique({
      where: { phone: dto.phone }
    })

    if (existPhone) {
      throw new BadRequestException("Phone number already exists")
    }

    const hash = await bcrypt.hash(dto.password, 10)

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        name: dto.name,
        role: dto.role,
        phone: dto.phone,
      }

    })

    return user 
  }

  async updateProfile(userId: number, dto: UpdateUserDto) {
    // check user tồn tại
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Rule: Cannot modify CUSTOMER
    if (user.role === UserRole.CUSTOMER) {
      throw new ForbiddenException('Cannot modify customer user information');
    }

    const data = Object.fromEntries(
      Object.entries(dto).filter(([_, v]) => v !== undefined)
    );
    // update
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });

  }

  async deleteProfile(userId: number) {
    // check user tồn tại
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        isDeleted: true,
        deletedAt: new Date()
      },
    });
  }
  async restoreProfile(userId: number) {
    // check user tồn tại
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { isDeleted: false, deletedAt: null },
    });
  }

  async getLoyaltyInfo(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        loyaltyPoint: true,
        totalOrders: true,
        totalSpent: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;

  }

  async updateLoyaltyFromOrder(userId: number, orderAmount: number) {
    // check user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const earnedPoints = Math.floor(orderAmount / 1000); // 1 point for every 1000 VND spent

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        totalOrders: { increment: 1 },
        totalSpent: { increment: orderAmount },
        loyaltyPoint: { increment: earnedPoints },
      },
      select: {
        id: true,
        totalOrders: true,
        totalSpent: true,
        loyaltyPoint: true,
      },
    });
  }

  async useLoyaltyPoints(userId: number, points: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.loyaltyPoint < points) {
      throw new BadRequestException('Not enough loyalty points');
    }

    if (points <= 0) {
      throw new BadRequestException('Points must be greater than 0');
    }

    const discount = points * 100; // 1 point = 100 VND discount

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        loyaltyPoint: { decrement: points },
      },
      select: {
        id: true,
        loyaltyPoint: true,
      }
    });

    return {
      ...updatedUser,
      discount,
    };
  }

  async updateUserRole(userId: number, newRole: UserRole) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const currentRole = user.role;

    // Rule: CUSTOMER can't become ADMIN or STAFF
    if (currentRole === UserRole.CUSTOMER && 
        (newRole === UserRole.ADMIN || newRole === UserRole.STAFF)) {
      throw new ForbiddenException('Customers cannot be promoted to staff or admin');
    }

    // Rule: STAFF/ADMIN can't downgrade to CUSTOMER
    if ((currentRole === UserRole.STAFF || currentRole === UserRole.ADMIN) && 
        newRole === UserRole.CUSTOMER) {
      throw new ForbiddenException('Staff and admin cannot be downgraded to customer');
    }

    //  Rule: STAFF → ADMIN is allowed (no extra checks needed, admin already verified by guard)

    //  Rule: ADMIN → STAFF, but check if ≥1 active admin remains
    if (currentRole === UserRole.ADMIN && newRole === UserRole.STAFF) {
      const activeAdmins = await this.prisma.user.count({
        where: {
          role: UserRole.ADMIN,
          isDeleted: false, // Only count active admins
          id: { not: userId }, // Exclude the user being demoted
        },
      });

      if (activeAdmins === 0) {
        throw new ForbiddenException(
          'Cannot demote the last active admin. At least one active admin must exist.',
        );
      }
    }

    // Proceed with update
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  }
}
