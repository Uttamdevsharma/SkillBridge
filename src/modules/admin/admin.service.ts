import { Role } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import { AppError } from "../../utils/error/AppError"

const fetchAnalytics = async () => {
  const [students, tutors, bookings] = await Promise.all([
    prisma.user.count({ where: { role: Role.STUDENT } }),
    prisma.user.count({ where: { role: Role.TUTOR } }),
    prisma.booking.count()
  ])

  return {
    totalStudents: students,
    totalTutors: tutors,
    totalBookings: bookings
  }
}

const fetchUsers = async (adminId: string) => {
    return prisma.user.findMany({
      where: {
        NOT: { id: adminId }
      },
      include: {
        tutorProfile: {
          include: {
            tutorCategories: {
              include: {
                category: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })
  }

const modifyUserStatus = async (userId: string, action: "BAN" | "UNBAN") => {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new AppError(404, "User not found")

  await prisma.user.update({
    where: { id: userId },
    data: {
      isBanned: action === "BAN"
    }
  })
}

const fetchBookings = async () => {
  return prisma.booking.findMany({
    include: {
      student: {
        select: { id: true, name: true, email: true }
      },
      tutor: {
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      },
      category: true
    },
    orderBy: {
      createdAt: "desc"
    }
  })
}


const addCategory = async (name: string) => {
  return prisma.category.create({
    data: { name }
  })
}

const editCategory = async (id: string, name: string) => {
  return prisma.category.update({
    where: { id },
    data: { name }
  })
}

const removeCategory = async (id: string) => {
  return prisma.category.delete({
    where: { id }
  })
}

export const adminService = {
  fetchAnalytics,
  fetchUsers,
  modifyUserStatus,
  fetchBookings,
  addCategory,
  editCategory,
  removeCategory
}