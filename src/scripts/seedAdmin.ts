
import bcrypt from "bcrypt"
import { Role } from "../../generated/prisma/enums"
import { prisma } from "../lib/prisma"


async function seedAdmin() {
  try {

    const existingAdmin = await prisma.user.findFirst({
      where: { role: Role.ADMIN }
    })

    if (existingAdmin) {
      console.log("Admin already exists")
      return
    }

    const hashedPassword = await bcrypt.hash("admin1234", 10)

    await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: Role.ADMIN,
        isBanned: false
      }
    })

    console.log("Admin seeded successfully")

  } catch (error) {
    console.error("Admin seed failed:", error)
  } finally {
    await prisma.$disconnect()
  }
}

seedAdmin()