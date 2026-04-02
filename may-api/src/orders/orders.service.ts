import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrderDto } from './dto/create-orders.dto.js';
import { OrdersGateway } from './orders.gateway.js';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ordersGateway: OrdersGateway
  ) { }

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
            product: true,
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
    const order = await this.prisma.order.findFirst({
      where: { id, isDeleted: false },
      include: {
        user: true,
        items: {
          include: {
            toppings: true,
            product: true,
          },
        },
        payments: true,
        logs: true,
      },
    });
    if (!order) {
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
    const { userId, phone, address, items, usedPoint: inputUsedPoint } = data;
    const usedPoint = inputUsedPoint || 0;

    if (!items || items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    return this.prisma.$transaction(async (prisma) => {
      //  1. Check user
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) throw new BadRequestException('User not found');

      if (usedPoint < 0) {
        throw new BadRequestException('usedPoint cannot be negative');
      }

      if (usedPoint > user.loyaltyPoint) {
        throw new BadRequestException('Not enough loyalty points');
      }

      // 2. Lấy tất cả product + topping 1 lần
      // Validate: check for duplicate productIds to avoid logic errors
      const productIds = items.map((i) => i.productId);
      const uniqueProductIds = [...new Set(productIds)];
      if (uniqueProductIds.length < productIds.length) {
        // Warning: duplicate products detected but allowed (will still be created)
      }

      const products = await prisma.product.findMany({
        where: { id: { in: uniqueProductIds } },
      });

      // Batch query toppings (UNIQUE to avoid redundant queries)
      const toppingIds = [...new Set(items.flatMap((i) => i.toppings || []))];

      const toppings = await prisma.topping.findMany({
        where: { id: { in: toppingIds } },
      });

      // dùng Map 
      const productMap = new Map(products.map((p) => [p.id, p]));
      const toppingMap = new Map(toppings.map((t) => [t.id, t]));

      // 🔹 3. Tạo order trước
      const order = await prisma.order.create({
        data: {
          userId,
          phone,
          address,
          status: 'PENDING',
          total: 0,
          usedPoint,
        },
      });

      let total = 0;

      //  Xử lý items
      for (const item of items) {
        if (item.quantity <= 0) {
          throw new BadRequestException('Quantity must be greater than 0');
        }

        const product = productMap.get(item.productId);
        if (!product) {
          throw new BadRequestException(
            `Product ${item.productId} not found`,
          );
        }

        const orderItem = await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: product.id,
            quantity: item.quantity,
            productName: product.name,
            basePrice: product.price,
          },
        });

        let itemTotal = product.price * item.quantity;

        // toppings
        if (item.toppings && item.toppings.length > 0) {
          for (const toppingId of item.toppings) {
            const topping = toppingMap.get(toppingId);
            if (!topping) {
              throw new BadRequestException(
                `Topping ${toppingId} not found`,
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

      // Apply usedPoint
      if (usedPoint > total) {
        throw new BadRequestException('usedPoint exceeds order total');
      }

      total = total - usedPoint;

      // 🔹 6. Tính earnedPoint (ví dụ 10%)
      const earnedPoint = Math.floor(total * 0.1);

      // 🔹 7. Update order
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          total,
          earnedPoint,
        },
        include: {
          user: true,
          items: {
            include: {
              toppings: true,
              product: true,
            },
          },
          payments: true,
          logs: true,
        },
      });

      //   Log
      await prisma.orderLog.create({
        data: {
          orderId: updatedOrder.id,
          status: 'PENDING',
          note: 'Order created',
        },
      });

      // Deduct loyalty points if usedPoint > 0
      if (usedPoint > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            loyaltyPoint: { decrement: usedPoint },
          },
        });
      }

      this.ordersGateway.emitNewOrder(updatedOrder);
      return updatedOrder;
    });
  }
  async updateStatus(id: number, status: OrderStatus, userId?: number) {
    const order = await this.findOne(id);

    // CRITICAL: Prevent double processing on COMPLETED
    if (order.status === 'COMPLETED' && status === 'COMPLETED') {
      throw new BadRequestException('Order already completed');
    }

    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['SHIPPING', 'CANCELLED'],
      SHIPPING: ['COMPLETED'],
      COMPLETED: [],
      CANCELLED: [],
    };

    if (!validTransitions[order.status].includes(status)) {
      throw new BadRequestException(
        `Cannot change status from ${order.status} to ${status}`,
      );
    }

    return this.prisma.$transaction(async (prisma) => {
      const updated = await prisma.order.update({
        where: { id },
        data: { status },
        include: {
          user: true,
          items: {
            include: {
              toppings: true,
              product: true,
            },
          },
          payments: true,
          logs: true,
        },
      })

      await prisma.orderLog.create({
        data: {
          orderId: id,
          status,
          updatedById: userId,
        },
      });

      if (status === 'COMPLETED') {
        await prisma.user.update({
          where: { id: order.userId },
          data: {
            totalOrders: { increment: 1 },
            totalSpent: { increment: order.total },
            loyaltyPoint: { increment: order.earnedPoint },
          },
        });
      }
      this.ordersGateway.emitOrderUpdated(updated)
      return updated;
    });
  }

  async updateInfo(
    id: number,
    data: { phone?: string; address?: string; usedPoint?: number },
  ) {
    const order = await this.findOne(id);

    if (order.status === 'COMPLETED' || order.status === 'CANCELLED') {
      throw new BadRequestException(
        'Cannot update info of completed or cancelled orders',
      );
    }

    const updateData: any = {};
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.address !== undefined) updateData.address = data.address;

    let newTotal = order.total;
    if (data.usedPoint !== undefined) {
      if (data.usedPoint < 0) {
        throw new BadRequestException('usedPoint cannot be negative');
      }

      // lấy user để check điểm
      const user = await this.prisma.user.findUnique({
        where: { id: order.userId },
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (data.usedPoint > user.loyaltyPoint + order.usedPoint) {
        throw new BadRequestException('Not enough loyalty points');
      }

      // recalculate total
      newTotal = order.total + order.usedPoint - data.usedPoint;

      // CRITICAL: Check total not negative
      if (newTotal < 0) {
        throw new BadRequestException('usedPoint exceeds order total');
      }

      updateData.usedPoint = data.usedPoint;
      updateData.total = newTotal;
    }

    return this.prisma.$transaction(async (prisma) => {
      // Guard: only calculate pointDifference if usedPoint was actually provided
      const pointDifference = data.usedPoint !== undefined ? data.usedPoint - order.usedPoint : 0;

      // Update user loyalty points if usedPoint changed
      if (pointDifference !== 0) {
        await prisma.user.update({
          where: { id: order.userId },
          data: {
            loyaltyPoint: { decrement: pointDifference },
          },
        });
      }

      return await prisma.order.update({
        where: { id },
        data: updateData,
        include: {
          user: true,
          items: {
            include: {
              toppings: true,
              product: true,
            },
          },
          payments: true,
          logs: true,
        },
      });
    })
  }
}
