import * as z from "zod"

export const createReviewValidation = z.object({
  bookingId: z.uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5)
})

export const updateReviewValidation = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().min(5).optional()
})