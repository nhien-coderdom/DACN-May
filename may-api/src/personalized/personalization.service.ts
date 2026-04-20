import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  PersonalizedResponseDto,
  PersonalizedProductDto,
  RecommendedToppingDto,
  ReorderComboDto,
  ReorderComboItemDto,
  ReorderComboItemToppingDto,
} from './dto/personalized-response.dto.js';
import { Prisma } from '@prisma/client';

type RawOrder = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: true;
        toppings: true;
      };
    };
  };
}>;

type FlattenedOrderItem = RawOrder['items'][number] & {
  orderCreatedAt: Date;
};

type GroupedProductInternal = {
  productId: number;
  productName: string;
  imageUrl?: string | null;
  currentPrice: number;
  timesOrdered: number;
  totalQty: number;
  lastOrderedAt: Date;
  toppingsMap: Map<string, RecommendedToppingDto>;
};

@Injectable()
export class PersonalizationService {
  constructor(private readonly prisma: PrismaService) {}

  async getPersonalizedData(userId: number): Promise<PersonalizedResponseDto> {
    const orders = await this.prisma.order.findMany({
      where: {
        userId,
        isDeleted: false,
        status: 'COMPLETED',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      include: {
        items: {
          include: {
            product: true,
            toppings: true,
          },
        },
      },
    });

    if (!orders.length) {
      return {
        favorites: [],
        recentlyOrdered: [],
        frequentlyOrdered: [],
        reorderCombos: [],
      };
    }

    const reorderCombos = this.buildReorderCombos(orders);

    const allItems: FlattenedOrderItem[] = orders.flatMap((order) =>
      order.items.map((item) => ({
        ...item,
        orderCreatedAt: order.createdAt,
      })),
    );

    const groupedProducts = this.groupProducts(allItems);

    const favorites = [...groupedProducts]
      .sort((a, b) => b.favoriteScore - a.favoriteScore)
      .slice(0, 8);

    const recentlyOrdered = [...groupedProducts]
      .sort(
        (a, b) =>
          new Date(b.lastOrderedAt).getTime() -
          new Date(a.lastOrderedAt).getTime(),
      )
      .slice(0, 8);

    const frequentlyOrdered = [...groupedProducts]
      .filter((p) => p.timesOrdered >= 2)
      .sort((a, b) => {
        if (b.timesOrdered !== a.timesOrdered) {
          return b.timesOrdered - a.timesOrdered;
        }
        return b.totalQty - a.totalQty;
      })
      .slice(0, 8);

    return {
      favorites,
      recentlyOrdered,
      frequentlyOrdered,
      reorderCombos,
    };
  }

  private buildReorderCombos(orders: RawOrder[]): ReorderComboDto[] {
    return orders.slice(0, 5).map((order) => ({
      orderId: order.id,
      createdAt: order.createdAt,
      total: order.total,
      items: order.items.map<ReorderComboItemDto>((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        basePrice: item.basePrice,
        toppings: item.toppings.map<ReorderComboItemToppingDto>((topping) => ({
          name: topping.toppingName,
          price: topping.toppingPrice,
        })),
      })),
    }));
  }

  private groupProducts(
    allItems: FlattenedOrderItem[],
  ): PersonalizedProductDto[] {
    const map = new Map<number, GroupedProductInternal>();
    const now = new Date();

    for (const item of allItems) {
      const existing = map.get(item.productId);

      if (!existing) {
        map.set(item.productId, {
          productId: item.productId,
          productName: item.productName,
          imageUrl: item.product?.imageUrl ?? null,
          currentPrice: item.product?.price ?? item.basePrice,
          timesOrdered: 1,
          totalQty: item.quantity,
          lastOrderedAt: item.orderCreatedAt,
          toppingsMap: new Map<string, RecommendedToppingDto>(),
        });
      } else {
        existing.timesOrdered += 1;
        existing.totalQty += item.quantity;

        if (item.orderCreatedAt > existing.lastOrderedAt) {
          existing.lastOrderedAt = item.orderCreatedAt;
        }
      }

      const target = map.get(item.productId);
      if (!target) continue;

      for (const topping of item.toppings) {
        const key = topping.toppingName;
        const existingTopping = target.toppingsMap.get(key);

        if (!existingTopping) {
          target.toppingsMap.set(key, {
            name: topping.toppingName,
            price: topping.toppingPrice,
            count: 1,
          });
        } else {
          existingTopping.count += 1;
        }
      }
    }

    return Array.from(map.values()).map<PersonalizedProductDto>((product) => {
      const daysAgo =
        (now.getTime() - new Date(product.lastOrderedAt).getTime()) /
        (1000 * 60 * 60 * 24);

      let recencyScore = 0;
      if (daysAgo <= 7) recencyScore = 10;
      else if (daysAgo <= 30) recencyScore = 5;
      else if (daysAgo <= 90) recencyScore = 2;

      const favoriteScore =
        product.timesOrdered * 5 + product.totalQty * 2 + recencyScore;

      const recommendedToppings = Array.from(product.toppingsMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      return {
        productId: product.productId,
        productName: product.productName,
        imageUrl: product.imageUrl ?? null,
        currentPrice: product.currentPrice,
        timesOrdered: product.timesOrdered,
        totalQty: product.totalQty,
        lastOrderedAt: product.lastOrderedAt,
        favoriteScore,
        recommendedToppings,
      };
    });
  }
}