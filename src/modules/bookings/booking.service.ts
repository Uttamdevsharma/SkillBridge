import { prisma } from "../../lib/prisma"
import { AppError } from "../../utils/error/AppError"


const createBooking = async (
  studentId: string,
  payload: { slotId: string }
) => {
  const slot = await prisma.availabilitySlot.findUnique({
    where: { id: payload.slotId },
    include: { tutor: true, category: true }
  })

  if (!slot) throw new AppError(404, "Slot not found")

  if (slot.isBooked) throw new AppError(400, "Slot already booked")

  const booking = await prisma.$transaction(async (tx) => {
    await tx.availabilitySlot.update({
      where: { id: payload.slotId },
      data: { isBooked: true }
    })

    return tx.booking.create({
      data: {
        studentId,
        tutorProfileId: slot.tutorProfileId,
        slotId: slot.id,
        categoryId: slot.categoryId,
        status: "CONFIRMED"
      },
      include: {
        tutor: { include: { user: true } },
        slot: true,
        category: true
      }
    })
  })

  return {
    id: booking.id,
    status: booking.status,
    subject: booking.category?.name,
    scheduledFor: {
      start: booking.slot.startTime,
      end: booking.slot.endTime
    },
    tutor: booking.tutor.user.name
  }
}

const getMyBookings = async (studentId: string) => {
  const bookings = await prisma.booking.findMany({
    where: {
      studentId
    },
    include: {
      slot: true,
      tutor: { include: { user: true } },
      category: true
    },
    orderBy: { createdAt: "desc" }
  })

  return bookings
}

const getBookingHistory = async (studentId: string) => {
  const bookings = await prisma.booking.findMany({
    where: {
      studentId,
      status: { in: ["COMPLETED", "CANCELLED"] }
    },
    include: {
      slot: true,
      tutor: { include: { user: true } },
      category: true
    },
    orderBy: { createdAt: "desc" }
  })

  return bookings
}

const cancelBooking = async (studentId: string, bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId }
  })

  if (!booking) throw new AppError(404, "Booking not found")
  if (booking.studentId !== studentId)
    throw new AppError(403, "Not authorized")

  await prisma.$transaction(async (tx) => {
    await tx.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" }
    })

    await tx.availabilitySlot.update({
      where: { id: booking.slotId },
      data: { isBooked: false }
    })
  })
}



export const bookingService = {
  createBooking,
  getMyBookings,
  getBookingHistory,
  cancelBooking
}