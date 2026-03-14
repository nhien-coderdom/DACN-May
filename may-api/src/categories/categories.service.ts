import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  // tạo category
  create(name: string, parentId?: number) {
    return this.prisma.category.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        parentId,
      },
    })
  }

  // lấy menu 2 cấp
  findMenu() {
    return this.prisma.category.findMany({
      where: { parentId: null },
      include: { children: true },
      orderBy: { order: 'asc' },
    })
  }

  // lấy children theo parent
  findChildren(parentId: number) {
    return this.prisma.category.findMany({
      where: { parentId },
    })
  }

  // update
  update(id: number, data: any) {
    return this.prisma.category.update({
      where: { id },
      data,
    })
  }

  // delete
  remove(id: number) {
    return this.prisma.category.delete({
      where: { id },
    })
  }
}
