import "dotenv/config"
import { PrismaClient, UserRole } from "@prisma/client"
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

  await prisma.user.upsert({
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

  await prisma.user.upsert({
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

  console.log("✅ Seed success")
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })