import * as z from "zod"

export const profileUpsertValidation = z.object({
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  hourlyRate: z.number().positive("Hourly rate must be positive")
})


export const addSubjectsValidation = z.object({
  categoryIds: z.array(z.string()).min(1, "Select at least one category")
})

export const createSlotValidation = z.object({
  categoryId: z.string(),
  startTime: z.iso.datetime(),
  endTime: z.iso.datetime()
})