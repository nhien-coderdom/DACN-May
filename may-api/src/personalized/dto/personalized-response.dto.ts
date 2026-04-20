import { ApiProperty } from '@nestjs/swagger';

export class RecommendedToppingDto {
  @ApiProperty({
    example: 'Trân châu đen',
    description: 'Tên topping được khách hàng thường chọn cùng sản phẩm này',
  })
  name!: string;

  @ApiProperty({
    example: 5000,
    description: 'Giá topping hiện tại hoặc snapshot giá topping',
  })
  price!: number;

  @ApiProperty({
    example: 7,
    description: 'Số lần topping này được chọn cùng sản phẩm',
  })
  count!: number;
}

export class PersonalizedProductDto {
  @ApiProperty({
    example: 1,
    description: 'ID sản phẩm',
  })
  productId!: number;

  @ApiProperty({
    example: 'Trà sữa trân châu',
    description: 'Tên sản phẩm',
  })
  productName!: string;

  @ApiProperty({
    example: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    nullable: true,
    required: false,
    description: 'Ảnh sản phẩm',
  })
  imageUrl?: string | null;

  @ApiProperty({
    example: 45000,
    description: 'Giá hiện tại của sản phẩm',
  })
  currentPrice!: number;

  @ApiProperty({
    example: 5,
    description: 'Số lần khách hàng đã gọi sản phẩm này',
  })
  timesOrdered!: number;

  @ApiProperty({
    example: 8,
    description: 'Tổng số lượng đã mua của sản phẩm này',
  })
  totalQty!: number;

  @ApiProperty({
    example: '2026-04-01T10:20:00.000Z',
    description: 'Thời điểm gần nhất khách hàng mua sản phẩm này',
  })
  lastOrderedAt!: Date;

  @ApiProperty({
    example: 41,
    description: 'Điểm yêu thích được tính từ tần suất, số lượng và độ gần đây',
  })
  favoriteScore!: number;

  @ApiProperty({
    type: [RecommendedToppingDto],
    description: 'Danh sách topping khách hàng hay chọn cùng sản phẩm này',
  })
  recommendedToppings!: RecommendedToppingDto[];
}

export class ReorderComboItemToppingDto {
  @ApiProperty({
    example: 'Trân châu đen',
    description: 'Tên topping trong đơn cũ',
  })
  name!: string;

  @ApiProperty({
    example: 5000,
    description: 'Giá topping tại thời điểm đơn hàng',
  })
  price!: number;
}

export class ReorderComboItemDto {
  @ApiProperty({
    example: 1,
    description: 'ID sản phẩm',
  })
  productId!: number;

  @ApiProperty({
    example: 'Trà sữa trân châu',
    description: 'Tên sản phẩm trong đơn hàng',
  })
  productName!: string;

  @ApiProperty({
    example: 2,
    description: 'Số lượng sản phẩm trong đơn hàng',
  })
  quantity!: number;

  @ApiProperty({
    example: 45000,
    description: 'Giá gốc sản phẩm tại thời điểm đặt hàng',
  })
  basePrice!: number;

  @ApiProperty({
    type: [ReorderComboItemToppingDto],
    description: 'Danh sách topping của item này trong đơn cũ',
  })
  toppings!: ReorderComboItemToppingDto[];
}

export class ReorderComboDto {
  @ApiProperty({
    example: 101,
    description: 'ID đơn hàng cũ có thể dùng để mua lại',
  })
  orderId!: number;

  @ApiProperty({
    example: '2026-04-01T10:20:00.000Z',
    description: 'Ngày tạo đơn hàng',
  })
  createdAt!: Date;

  @ApiProperty({
    example: 95000,
    description: 'Tổng giá trị đơn hàng',
  })
  total!: number;

  @ApiProperty({
    type: [ReorderComboItemDto],
    description: 'Danh sách sản phẩm trong đơn để user có thể mua lại nhanh',
  })
  items!: ReorderComboItemDto[];
}

export class PersonalizedResponseDto {
  @ApiProperty({
    type: [PersonalizedProductDto],
    description: 'Danh sách sản phẩm được xếp hạng yêu thích nhất của khách hàng',
  })
  favorites!: PersonalizedProductDto[];

  @ApiProperty({
    type: [PersonalizedProductDto],
    description: 'Danh sách sản phẩm khách hàng đã mua gần đây',
  })
  recentlyOrdered!: PersonalizedProductDto[];

  @ApiProperty({
    type: [PersonalizedProductDto],
    description: 'Danh sách sản phẩm khách hàng mua thường xuyên',
  })
  frequentlyOrdered!: PersonalizedProductDto[];

  @ApiProperty({
    type: [ReorderComboDto],
    description: 'Danh sách các đơn gần đây để khách hàng có thể mua lại nhanh',
  })
  reorderCombos!: ReorderComboDto[];
}