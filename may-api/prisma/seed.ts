import "dotenv/config"
import { PrismaClient, UserRole } from "@prisma/client"
import bcrypt from "bcrypt"

if (!process.env.DATABASE_URL) {
  throw new Error(" DATABASE_URL is not set. Please check your .env file")
}

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding basic data...")

  const hashedPassword = await bcrypt.hash("123456", 10)

  // ================= USER =================
  const user = await prisma.user.upsert({
    where: { email: "admin@may.com" },
    update: {},
    create: {
      email: "admin@may.com",
      password: hashedPassword,
      name: "Admin MAY",
      phone: "0901234567",
      role: UserRole.ADMIN,
    },
  })

  // ================= CATEGORY =================
  const milkTea = await prisma.category.create({
    data: {
      name: "Trà sữa",
      slug: "tra-sua",
      order: 1,
    },
  })

  const fruitTea = await prisma.category.create({
    data: {
      name: "Trà trái cây",
      slug: "tra-trai-cay",
      order: 2,
    },
  })

  // ================= TOPPING =================
  const topping1 = await prisma.topping.create({
    data: {
      name: "Trân châu đen",
      price: 10000,
    },
  })

  const topping2 = await prisma.topping.create({
    data: {
      name: "Pudding",
      price: 12000,
    },
  })

  // ================= PRODUCT =================
  const product1 = await prisma.product.create({
    data: {
      name: "Trà sữa truyền thống",
      price: 45000,
      categoryId: milkTea.id,
      imageUrl: "https://example.com/milk-tea.jpg",
    },
  })

  const product2 = await prisma.product.create({
    data: {
      name: "Trà đào",
      price: 48000,
      categoryId: fruitTea.id,
      imageUrl: "https://example.com/peach-tea.jpg",
    },
  })

  console.log(" Seed xong:")
  console.log("- User:", user.email)
  console.log("- Category:", milkTea.name, fruitTea.name)
  console.log("- Product:", product1.name, product2.name)
  console.log("- Topping:", topping1.name, topping2.name)
}

main()
  .catch((e) => {
    console.error(" Seed failed:", e.message || e)
    if (e.message?.includes("Can't reach database server")) {
      console.error("💡 Tip: Ensure your Supabase database is running and accessible")
    }
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })