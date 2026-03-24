export class CreateOrderDto {
  userId: number;
  phone: string;
  address: string;

  items: {
    productId: number;
    quantity: number;
    toppings?: number[];
  }[];
}