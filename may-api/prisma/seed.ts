import "dotenv/config"
import { PrismaClient, UserRole, OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import bcrypt from "bcrypt"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({
  adapter,
})

async function main() {
  console.log("🌱 Start seeding...")

  const password = await bcrypt.hash("123456", 10)

  // ================= USER =================
  const admin = await prisma.user.upsert({
    where: { email: "admin@may.com" },
    update: {},
    create: {
      email: "admin@may.com",
      phone: "0900000001",
      name: "Admin",
      role: UserRole.ADMIN,
      password,
    },
  })

  const staff = await prisma.user.upsert({
    where: { email: "staff@may.com" },
    update: {},
    create: {
      email: "staff@may.com",
      phone: "0900000002",
      name: "Staff",
      role: UserRole.STAFF,
      password,
    },
  })

  const customer = await prisma.user.upsert({
    where: { email: "customer@may.com" },
    update: {},
    create: {
      email: "customer@may.com",
      phone: "0900000003",
      name: "Customer",
      role: UserRole.CUSTOMER,
      password,
    },
  })

  // ================= CATEGORY =================
  const milkTea = await prisma.category.create({
    data: {
      name: "Trà sữa",
      slug: "tra-sua",
    },
  })

  const fruitTea = await prisma.category.create({
    data: {
      name: "Trà trái cây",
      slug: "tra-trai-cay",
    },
  })

  // ================= TOPPING =================
  const pearl = await prisma.topping.create({
    data: {
      name: "Trân châu đen",
      price: 5000,
    },
  })

  const pudding = await prisma.topping.create({
    data: {
      name: "Pudding trứng",
      price: 7000,
    },
  })

  // ================= PRODUCT =================
  const tsTruyenThong = await prisma.product.create({
    data: {
      name: "Trà sữa truyền thống",
      price: 30000,
      categoryId: milkTea.id,
      imageUrl: "https://example.com/milk-tea.jpg",
      toppings: {
        create: [
          { toppingId: pearl.id },
          { toppingId: pudding.id },
        ],
      },
    },
  })

  const tsMatcha = await prisma.product.create({
    data: {
      name: "Trà sữa matcha",
      price: 35000,
      categoryId: milkTea.id,
    },
  })

  const traDao = await prisma.product.create({
    data: {
      name: "Trà đào cam sả",
      price: 40000,
      categoryId: fruitTea.id,
    },
  })

  // ================= ORDER =================
  const order = await prisma.order.create({
    data: {
      userId: customer.id,
      total: 75000,
      phone: "0900000003",
      address: "HCM City",
      status: OrderStatus.PENDING,
      items: {
        create: [
          {
            productId: tsTruyenThong.id,
            quantity: 2,
            productName: tsTruyenThong.name,
            basePrice: tsTruyenThong.price,
            toppings: {
              create: [
                {
                  toppingName: pearl.name,
                  toppingPrice: pearl.price,
                },
              ],
            },
          },
        ],
      },
      logs: {
        create: [
          {
            status: OrderStatus.PENDING,
            note: "Order created",
            updatedById: staff.id,
          },
        ],
      },
      payments: {
        create: [
          {
            method: PaymentMethod.CASH,
            amount: 75000,
            status: PaymentStatus.PENDING,
          },
        ],
      },
    },
  })

  console.log("✅ Seed success")
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })