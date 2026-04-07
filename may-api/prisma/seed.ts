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

async function main() {
  console.log("🌱 Start seeding milk tea shop data...")

  await prisma.payment.deleteMany()
  await prisma.orderLog.deleteMany()
  await prisma.orderItemTopping.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.productTopping.deleteMany()
  await prisma.topping.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  const hashedPassword = await bcrypt.hash("123456", 10)

  const admin = await prisma.user.create({
    data: {
      email: "admin@may.com",
      password: hashedPassword,
      name: "Admin MAY",
      phone: "0900000001",
      address: "Quận 1, TP.HCM",
      role: UserRole.ADMIN,
    },
  })

  const staff = await prisma.user.create({
    data: {
      email: "staff@may.com",
      password: hashedPassword,
      name: "Staff MAY",
      phone: "0900000002",
      address: "Thủ Đức, TP.HCM",
      role: UserRole.STAFF,
    },
  })

  const customer = await prisma.user.create({
    data: {
      email: "customer@may.com",
      password: hashedPassword,
      name: "Nguyễn Thị Trà",
      phone: "0900000003",
      address: "Bình Thạnh, TP.HCM",
      role: UserRole.CUSTOMER,
      loyaltyPoint: 150,
      totalOrders: 5,
      totalSpent: 780000,
    },
  })

  const milkTeaCategory = await prisma.category.create({
    data: {
      name: "Trà sữa",
      slug: "tra-sua",
      order: 1,
    },
  })

  const fruitTeaCategory = await prisma.category.create({
    data: {
      name: "Trà trái cây",
      slug: "tra-trai-cay",
      order: 2,
    },
  })

  const blackPearl = await prisma.topping.create({
    data: {
      name: "Trân châu đen",
      price: 10000,
    },
  })

  const whitePearl = await prisma.topping.create({
    data: {
      name: "Trân châu trắng",
      price: 10000,
    },
  })

  const pudding = await prisma.topping.create({
    data: {
      name: "Pudding trứng",
      price: 12000,
    },
  })

  const jelly = await prisma.topping.create({
    data: {
      name: "Thạch trái cây",
      price: 12000,
    },
  })

  const cheeseFoam = await prisma.topping.create({
    data: {
      name: "Kem cheese",
      price: 15000,
    },
  })

  const traditionalMilkTea = await prisma.product.create({
    data: {
      name: "Trà sữa truyền thống",
      price: 45000,
      description: "Trà sữa vị truyền thống đậm đà",
      categoryId: milkTeaCategory.id,
      imageUrl: "https://example.com/traditional-milk-tea.jpg",
    },
  })

  const matchaMilkTea = await prisma.product.create({
    data: {
      name: "Trà sữa matcha",
      price: 50000,
      description: "Matcha thơm béo",
      categoryId: milkTeaCategory.id,
      imageUrl: "https://example.com/matcha-milk-tea.jpg",
    },
  })

  const brownSugarMilk = await prisma.product.create({
    data: {
      name: "Sữa tươi trân châu đường đen",
      price: 55000,
      description: "Best seller của quán",
      categoryId: milkTeaCategory.id,
      imageUrl: "https://example.com/brown-sugar-milk.jpg",
    },
  })

  const peachTea = await prisma.product.create({
    data: {
      name: "Trà đào cam sả",
      price: 48000,
      description: "Trà trái cây thanh mát",
      categoryId: fruitTeaCategory.id,
      imageUrl: "https://example.com/peach-tea.jpg",
    },
  })

  const lycheeTea = await prisma.product.create({
    data: {
      name: "Trà vải",
      price: 42000,
      description: "Trà vải mát lạnh",
      categoryId: fruitTeaCategory.id,
      imageUrl: "https://example.com/lychee-tea.jpg",
    },
  })

  await prisma.productTopping.createMany({
    data: [
      { productId: traditionalMilkTea.id, toppingId: blackPearl.id },
      { productId: traditionalMilkTea.id, toppingId: pudding.id },
      { productId: traditionalMilkTea.id, toppingId: cheeseFoam.id },
      { productId: matchaMilkTea.id, toppingId: whitePearl.id },
      { productId: matchaMilkTea.id, toppingId: pudding.id },
      { productId: matchaMilkTea.id, toppingId: cheeseFoam.id },
      { productId: brownSugarMilk.id, toppingId: blackPearl.id },
      { productId: brownSugarMilk.id, toppingId: pudding.id },
      { productId: peachTea.id, toppingId: jelly.id },
      { productId: peachTea.id, toppingId: whitePearl.id },
      { productId: lycheeTea.id, toppingId: jelly.id },
      { productId: lycheeTea.id, toppingId: whitePearl.id },
    ],
  })

  const order1 = await prisma.order.create({
    data: {
      userId: customer.id,
      phone: customer.phone,
      address: customer.address || "Bình Thạnh, TP.HCM",
      total: 112000,
      status: OrderStatus.PENDING,
      earnedPoint: 11,
      usedPoint: 0,
    },
  })

  const order1Item1 = await prisma.orderItem.create({
    data: {
      orderId: order1.id,
      productId: traditionalMilkTea.id,
      quantity: 2,
      productName: traditionalMilkTea.name,
      basePrice: traditionalMilkTea.price,
    },
  })

  await prisma.orderItemTopping.create({
    data: {
      orderItemId: order1Item1.id,
      toppingName: blackPearl.name,
      toppingPrice: blackPearl.price,
    },
  })

  await prisma.orderItem.create({
    data: {
      orderId: order1.id,
      productId: lycheeTea.id,
      quantity: 1,
      productName: lycheeTea.name,
      basePrice: lycheeTea.price,
    },
  })

  await prisma.orderLog.create({
    data: {
      orderId: order1.id,
      status: OrderStatus.PENDING,
      note: "Order created",
      updatedById: customer.id,
    },
  })

  await prisma.payment.create({
    data: {
      orderId: order1.id,
      method: PaymentMethod.CASH,
      status: PaymentStatus.PENDING,
      amount: 112000,
    },
  })

  const order2 = await prisma.order.create({
    data: {
      userId: customer.id,
      phone: customer.phone,
      address: "Quận 3, TP.HCM",
      total: 115000,
      status: OrderStatus.CONFIRMED,
      earnedPoint: 11,
      usedPoint: 10,
    },
  })

  const order2Item1 = await prisma.orderItem.create({
    data: {
      orderId: order2.id,
      productId: matchaMilkTea.id,
      quantity: 1,
      productName: matchaMilkTea.name,
      basePrice: matchaMilkTea.price,
    },
  })

  await prisma.orderItemTopping.create({
    data: {
      orderItemId: order2Item1.id,
      toppingName: pudding.name,
      toppingPrice: pudding.price,
    },
  })

  const order2Item2 = await prisma.orderItem.create({
    data: {
      orderId: order2.id,
      productId: peachTea.id,
      quantity: 1,
      productName: peachTea.name,
      basePrice: peachTea.price,
    },
  })

  await prisma.orderItemTopping.create({
    data: {
      orderItemId: order2Item2.id,
      toppingName: jelly.name,
      toppingPrice: jelly.price,
    },
  })

  await prisma.orderLog.createMany({
    data: [
      {
        orderId: order2.id,
        status: OrderStatus.PENDING,
        note: "Order created",
        updatedById: customer.id,
      },
      {
        orderId: order2.id,
        status: OrderStatus.CONFIRMED,
        note: "Order confirmed by staff",
      },
    ],
  })

  await prisma.payment.create({
    data: {
      orderId: order2.id,
      method: PaymentMethod.MOMO,
      status: PaymentStatus.SUCCESS,
      amount: 115000,
      transactionId: "MOMO_TXN_001",
      paidAt: new Date(),
    },
  })

  const order3 = await prisma.order.create({
    data: {
      userId: customer.id,
      phone: customer.phone,
      address: "Quận 7, TP.HCM",
      total: 70000,
      status: OrderStatus.SHIPPING,
      earnedPoint: 7,
      usedPoint: 0,
    },
  })

  const order3Item1 = await prisma.orderItem.create({
    data: {
      orderId: order3.id,
      productId: brownSugarMilk.id,
      quantity: 1,
      productName: brownSugarMilk.name,
      basePrice: brownSugarMilk.price,
    },
  })

  await prisma.orderItemTopping.create({
    data: {
      orderItemId: order3Item1.id,
      toppingName: blackPearl.name,
      toppingPrice: blackPearl.price,
    },
  })

  await prisma.orderLog.createMany({
    data: [
      {
        orderId: order3.id,
        status: OrderStatus.PENDING,
        note: "Order created",
        updatedById: customer.id,
      },
      {
        orderId: order3.id,
        status: OrderStatus.CONFIRMED,
        note: "Order confirmed by staff",
      },
      {
        orderId: order3.id,
        status: OrderStatus.SHIPPING,
      },
    ],
  })

  await prisma.payment.create({
    data: {
      orderId: order3.id,
      method: PaymentMethod.BANK_TRANSFER,
      status: PaymentStatus.SUCCESS,
      amount: 70000,
      transactionId: "BANK_TXN_001",
      paidAt: new Date(),
    },
  })

  const order4 = await prisma.order.create({
    data: {
      userId: customer.id,
      phone: customer.phone,
      address: "Gò Vấp, TP.HCM",
      total: 117000,
      status: OrderStatus.COMPLETED,
      earnedPoint: 11,
      usedPoint: 0,
    },
  })

  const order4Item1 = await prisma.orderItem.create({
    data: {
      orderId: order4.id,
      productId: traditionalMilkTea.id,
      quantity: 1,
      productName: traditionalMilkTea.name,
      basePrice: traditionalMilkTea.price,
    },
  })

  await prisma.orderItemTopping.create({
    data: {
      orderItemId: order4Item1.id,
      toppingName: cheeseFoam.name,
      toppingPrice: cheeseFoam.price,
    },
  })

  await prisma.orderItem.create({
    data: {
      orderId: order4.id,
      productId: peachTea.id,
      quantity: 1,
      productName: peachTea.name,
      basePrice: peachTea.price,
    },
  })

  await prisma.orderLog.createMany({
    data: [
      {
        orderId: order4.id,
        status: OrderStatus.PENDING,
        note: "Order created",
        updatedById: customer.id,
      },
      {
        orderId: order4.id,
        status: OrderStatus.CONFIRMED,
        note: "Order confirmed by staff",
      },
      {
        orderId: order4.id,
        status: OrderStatus.SHIPPING,
        note: "Order shipped",
      },
      {
        orderId: order4.id,
        status: OrderStatus.COMPLETED,
        note: "Order completed",
      },
    ],
  })

  await prisma.payment.create({
    data: {
      orderId: order4.id,
      method: PaymentMethod.CASH,
      status: PaymentStatus.SUCCESS,
      amount: 117000,
      paidAt: new Date(),
    },
  })

  const order5 = await prisma.order.create({
    data: {
      userId: customer.id,
      phone: customer.phone,
      address: "Tân Bình, TP.HCM",
      total: 52000,
      status: OrderStatus.CANCELLED,
      earnedPoint: 0,
      usedPoint: 0,
    },
  })

  await prisma.orderItem.create({
    data: {
      orderId: order5.id,
      productId: lycheeTea.id,
      quantity: 1,
      productName: lycheeTea.name,
      basePrice: lycheeTea.price,
    },
  })

  await prisma.orderItemTopping.create({
    data: {
      orderItemId: (
        await prisma.orderItem.findFirstOrThrow({
          where: { orderId: order5.id },
        })
      ).id,
      toppingName: whitePearl.name,
      toppingPrice: whitePearl.price,
    },
  })

  await prisma.orderLog.createMany({
    data: [
      {
        orderId: order5.id,
        status: OrderStatus.PENDING,
        note: "Order created",
        updatedById: customer.id,
      },
      {
        orderId: order5.id,
        status: OrderStatus.CANCELLED,
        note: "Customer cancelled order",
        updatedById: customer.id,
      },
    ],
  })

  await prisma.payment.create({
    data: {
      orderId: order5.id,
      method: PaymentMethod.CASH,
      status: PaymentStatus.FAILED,
      amount: 52000,
    },
  })

  console.log("✅ Seed completed!")
  console.log("---------------------------")
  console.log("Admin login:")
  console.log("email: admin@may.com")
  console.log("password: 123456")
  console.log("---------------------------")
  console.log("Staff login:")
  console.log("email: staff@may.com")
  console.log("password: 123456")
  console.log("---------------------------")
  console.log("Customer login:")
  console.log("email: customer@may.com")
  console.log("password: 123456")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
