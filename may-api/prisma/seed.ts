import "dotenv/config"
import {
  PrismaClient,
  UserRole,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "@prisma/client"
import bcrypt from "bcrypt"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Please check your .env file")
}

const prisma = new PrismaClient()

async function resetConnection() {
  await prisma.$disconnect()
  // Give the connection pool time to reset
  await new Promise((resolve) => setTimeout(resolve, 500))
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

async function main() {
  console.log("🌱 Seeding database...")

  // Cleanup existing data with error handling
  console.log("🧹 Cleaning up existing data...")
  try {
    await prisma.$executeRaw`TRUNCATE TABLE "OrderLog" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "OrderItemTopping" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "OrderItem" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "Payment" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "Order" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "ProductTopping" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "Product" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "Category" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "Topping" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE;`
    console.log("✓ Cleanup done")
  } catch (e) {
    console.log("⚠️ Cleanup skipped (tables may already be empty)")
  }

  const hashedPassword = await bcrypt.hash("123456", 10)

  // ======================
  // USERS
  // ======================
  const admins: any[] = []
  for (let i = 1; i <= 3; i++) {
    const user = await prisma.user.create({
      data: {
        email: `admin${i}@gmail.com`,
        password: hashedPassword,
        name: `Admin ${i}`,
        phone: `09000000${i}`,
        role: UserRole.ADMIN,
      },
    })
    admins.push(user)
  }

  const staffs: any[] = []
  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.create({
      data: {
        email: `staff${i}@gmail.com`,
        password: hashedPassword,
        name: `Staff ${i}`,
        phone: `09100000${i}`,
        role: UserRole.STAFF,
      },
    })
    staffs.push(user)
  }

  const customers: any[] = []
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i}@gmail.com`,
        password: hashedPassword,
        name: `Customer ${i}`,
        phone: `09200000${i}`,
        role: UserRole.CUSTOMER,
      },
    })
    customers.push(user)
  }

  console.log("✓ Users created")

  // ======================
  // CATEGORY (parent-child)
  // ======================
  const drinks = await prisma.category.create({
    data: {
      name: "Đồ uống",
      slug: "do-uong",
    },
  })

  const milkTea = await prisma.category.create({
    data: {
      name: "Trà sữa",
      slug: "tra-sua",
      parentId: drinks.id,
    },
  })

  const fruitTea = await prisma.category.create({
    data: {
      name: "Trà trái cây",
      slug: "tra-trai-cay",
      parentId: drinks.id,
    },
  })

  console.log("✓ Categories created")

  // ======================
  // TOPPINGS
  // ======================
  const toppingList = [
    { name: "Trân châu đen", price: 5000 },
    { name: "Trân châu trắng", price: 5000 },
    { name: "Pudding trứng", price: 7000 },
    { name: "Thạch trái cây", price: 6000 },
    { name: "Kem cheese", price: 10000 },
  ]

  const toppings: any[] = []
  for (const t of toppingList) {
    const topping = await prisma.topping.create({ data: t })
    toppings.push(topping)
  }

  console.log("✓ Toppings created")

  // ======================
  // PRODUCTS
  // ======================
  const productList = [
    { name: "Trà sữa truyền thống", price: 30000, categoryId: milkTea.id },
    { name: "Trà sữa matcha", price: 35000, categoryId: milkTea.id },
    { name: "Trà sữa socola", price: 40000, categoryId: milkTea.id },
    { name: "Trà đào cam sả", price: 45000, categoryId: fruitTea.id },
    { name: "Trà vải", price: 42000, categoryId: fruitTea.id },
  ]

  const products: any[] = []
  for (const p of productList) {
    const product = await prisma.product.create({
      data: {
        ...p,
        toppings: {
          create: toppings.map((t) => ({
            toppingId: t.id,
          })),
        },
      },
    })
    products.push(product)
  }

  console.log("✓ Products created")

  // ======================
  // ORDERS
  // ======================
  for (let i = 0; i < 20; i++) {
    const user = randomFrom(customers)

    const numItems = randomInt(1, 3)

    let total = 0
    const itemsData: any[] = []

    for (let j = 0; j < numItems; j++) {
      const product = randomFrom(products)
      const quantity = randomInt(1, 2)

      total += product.price * quantity

      itemsData.push({
        productId: product.id,
        quantity,
        productName: product.name,
        basePrice: product.price,
      })
    }

    const status = randomFrom([
      OrderStatus.PENDING,
      OrderStatus.CONFIRMED,
      OrderStatus.SHIPPING,
      OrderStatus.COMPLETED,
      OrderStatus.CANCELLED,
    ])

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        status,
        phone: user.phone,
        address: "TP.HCM",
        items: {
          create: itemsData,
        },
      },
    })

    // payment
    await prisma.payment.create({
      data: {
        orderId: order.id,
        method: randomFrom([
          PaymentMethod.CASH,
          PaymentMethod.MOMO,
          PaymentMethod.VNPAY,
        ]),
        status:
          status === OrderStatus.COMPLETED
            ? PaymentStatus.SUCCESS
            : PaymentStatus.PENDING,
        amount: total,
      },
    })

    // log
    await prisma.orderLog.create({
      data: {
        orderId: order.id,
        status,
        updatedById: randomFrom(staffs).id,
        note: "Seed data",
      },
    })
  }

  console.log("✓ Orders created")

  console.log("🎉 Seeding done")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e.message || e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })