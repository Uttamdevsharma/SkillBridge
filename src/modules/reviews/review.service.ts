import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/error/AppError";


const createReview = async (
  studentId: string,
  payload: { bookingId: string; rating: number; comment: string }
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: payload.bookingId }
  })

  if (!booking) throw new AppError(404, "Booking not found")

  if (booking.studentId !== studentId)
    throw new AppError(403, "You can only review your own booking")

  if (booking.status !== "COMPLETED")
    throw new AppError(400, "Review allowed only after completed session")

  const existing = await prisma.review.findUnique({
    where: { bookingId: payload.bookingId }
  })

  if (existing)
    throw new AppError(400, "Review already exists for this booking")

  return prisma.review.create({
    data: {
      rating: payload.rating,
      comment: payload.comment,
      bookingId: payload.bookingId,
      studentId,
      tutorProfileId: booking.tutorProfileId
    }
  })
}

const updateReview = async (
  studentId: string,
  reviewId: string,
  payload: { rating?: number; comment?: string }
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId }
  })

  if (!review) throw new AppError(404, "Review not found")

  if (review.studentId !== studentId)
    throw new AppError(403, "You can update only your own review")

  return prisma.review.update({
    where: { id: reviewId },
    data: payload
  })
}

const deleteReview = async (studentId: string, reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId }
  })

  if (!review) throw new AppError(404, "Review not found")

  if (review.studentId !== studentId)
    throw new AppError(403, "You can delete only your own review")

  await prisma.review.delete({
    where: { id: reviewId }
  })
}

const getMyReviews = async (studentId: string) => {
  return prisma.review.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" }
  })
}



export const reviewService = {
  createReview,
  updateReview,
  deleteReview,
  getMyReviews
}