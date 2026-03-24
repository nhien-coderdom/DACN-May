//lõi logic, độc lập
//query database CRUD
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service.js"
@Injectable() // đánh dấu class này là service
export class ToppingsService {
    constructor(
        private prisma: PrismaService // định nghĩa prisma = object để query database => nestjs sẽ tự tạo và đưa vào
    ) {}
    async findAll()
    {
        return this.prisma.topping.findMany()
    }

    async findOne(id: number)
    {
        const topping = await this.prisma.topping.findUnique({
            where: {id}
        })
        if (!topping) {
            throw new Error("Topping not found")
        }
        return topping;
    }

    async create (data: {name: string; price: number})
    {
        return this.prisma.topping.create({
           data: {
            name: data.name,
            price: data.price
           }
        })
    }

    async update (id: number, data: {name?: string; price?: number}){
        // await: // tạm dừng thực hiện đến khi findOne(id) đc tìm thấy hoặc bị từ chối => đảm bảo id tồn tại trước khi update
        await this.findOne(id) 

        return this.prisma.topping.update({
            where: {id},
            data,
        })
    }

    async delete(id: number) {
  await this.findOne(id);

  const used = await this.prisma.productTopping.findFirst({
    where: { toppingId: id }
  });

  if (used) {
    throw new BadRequestException('Topping is being used');
  }

  return this.prisma.topping.delete({
    where: { id }
  });
}
}