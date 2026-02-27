import * as z from "zod"

export const createBookingValidation = z.object({
  slotId: z.uuid()
})

export const cancelBookingValidation = z.object({
  reason: z.string().optional()
})