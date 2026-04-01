import {BadRequestException,Injectable,NotFoundException,} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto) {
    const category = await this.prisma.category.findFirst({
      where: {
        id: data.categoryId,
        isDeleted: false,
      },
    });

    if (!category) {
      throw new BadRequestException('Category không tồn tại');
    }

    return this.prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        description: data.description,
        categoryId: data.categoryId,
        imageUrl: data.imageUrl,
      },
      include: {
        category: true,
        toppings: {
          include: {
            topping: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        category: true,
        toppings: {
          include: {
            topping: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
        isDeleted: false,
      },
      include: {
        category: true,
        toppings: {
          include: {
            topping: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Không tìm thấy product');
    }

    return product;
  }

  async update(id: number, data: UpdateProductDto) {
    await this.findOne(id);

    if (data.categoryId) {
      const category = await this.prisma.category.findFirst({
        where: {
          id: data.categoryId,
          isDeleted: false,
        },
      });

      if (!category) {
        throw new BadRequestException('Category không tồn tại');
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        price: data.price,
        description: data.description,
        categoryId: data.categoryId,
        imageUrl: data.imageUrl,
      },
      include: {
        category: true,
        toppings: {
          include: {
            topping: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }
}