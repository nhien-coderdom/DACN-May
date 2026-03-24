import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrderDto } from './dto/create-orders.dto.js';
import { OrderStatus } from '@prisma/client';
@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.order.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        user: true,
        items: {
          include: {
            toppings: true,
          },
        },
        payments: true,
        logs: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    //findUnique: Tìm 1 order duy nhất theo id
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: {
          include: {
            toppings: true,
          },
        },
        payments: true,
        logs: true,
      },
    });
    if (!order || order.isDeleted) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async delete(id: number, userId?: number) {
    const order = await this.findOne(id);

    if (order.status !== 'CANCELLED') {
      throw new BadRequestException('Only cancelled orders can be deleted');
    }

    return this.prisma.$transaction(async (prisma) => {
      const deleted = await prisma.order.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });

      await prisma.orderLog.create({
        data: {
          orderId: id,
          status: 'CANCELLED',
          note: 'Soft deleted order',
          updatedById: userId,
        },
      });

      return deleted;
    });
  }

  async create(data: CreateOrderDto) {
    // items (orderitems) BỰ -> có proudct -> toppoing
    const { userId, phone, address, items } = data;

    if (!items || items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }
    return this.prisma.$transaction(async (prisma) => {
      // check user tồn tại
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new BadRequestException('User not found');
      }
      // tạo order
      const order = await prisma.order.create({
        data: {
          userId,
          phone,
          address,
          total: 0,
          status: 'PENDING',
        },
      });
      let total = 0;

      // xử lý items
      for (const item of items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (!product) {
          throw new BadRequestException(
            `Product with id ${item.productId} not found`,
          );
        }
        const orderItem = await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            productName: product.name,
            basePrice: product.price,
          },
        });
        let itemTotal = product.price * item.quantity;

        // topping
        if (item.toppings && item.toppings.length > 0) {
          for (const toppingId of item.toppings) {
            const topping = await prisma.topping.findUnique({
              where: { id: toppingId },
            });
            if (!topping) {
              throw new BadRequestException(
                `Topping with id ${toppingId} not found`,
              );
            }

            await prisma.orderItemTopping.create({
              data: {
                orderItemId: orderItem.id,
                toppingName: topping.name,
                toppingPrice: topping.price,
              },
            });
            itemTotal += topping.price * item.quantity;
          }
        }
        total += itemTotal;
      }

      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: { total },
        include: {
          user: true,
          items: {
            include: {
              toppings: true,
            },
          },
          payments: true,
          logs: true,
        },
      });

      // Tạo OrderLog để ghi lại lần tạo đơn
      await prisma.orderLog.create({
        data: {
          orderId: updatedOrder.id,
          status: 'PENDING',
          note: 'Order created',
        },
      });

      return updatedOrder;
    });
  }
  async updateStatus(id: number, status: OrderStatus, userId?: number) {
    const order = await this.findOne(id)

    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['SHIPPING', 'CANCELLED'],
      SHIPPING: ['COMPLETED'],
      COMPLETED: [],
      CANCELLED: [],
    }

    if (!validTransitions[order.status].includes(status)) {
      throw new BadRequestException(
        `Cannot change status from ${order.status} to ${status}`,
      )
    }

    return this.prisma.$transaction(async (prisma) => {
      const updated = await prisma.order.update({
        where: { id },
        data: { status },
      })

      await prisma.orderLog.create({
        data: {
          orderId: id,
          status,
          updatedById: userId,
        },
      })

      if (status === 'COMPLETED') {
        await prisma.user.update({
          where: { id: order.userId },
          data: {
            totalOrders: { increment: 1 },
            totalSpent: { increment: order.total },
            loyaltyPoint: { increment: order.earnedPoint },
          },
        })
      }

      return updated
    })
  }

  async updateInfo(id: number, data: { phone?: string; address?: string; usedPoint?: number }) {
    const order = await this.findOne(id)

    if (order.status === 'COMPLETED' || order.status === 'CANCELLED') {
      throw new BadRequestException('Cannot update info of completed or cancelled orders')
    }

    const updateData: any = {}
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.address !== undefined) updateData.address = data.address
    if (data.usedPoint !== undefined) updateData.usedPoint = data.usedPoint

    return this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        items: {
          include: {
            toppings: true,
          },
        },
        payments: true,
        logs: true,
      },
    })
  }
}
