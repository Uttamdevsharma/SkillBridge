import * as z from "zod"
import { Role } from "../../../generated/prisma/enums"


export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.email("Invalid email format"),
  password: z.string().min(5, "Password must be at least 5 characters"),
  role: z.enum(Role),

  tutorProfile: z.object({
    bio: z.string(),
    hourlyRate: z.number(),
    categoryId: z.string()
  }).optional()
})

export const updateProfileSchema = registerSchema
  .omit({ tutorProfile: true, password: true, role: true })
  .partial()

  
export const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(5)
})

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(5),
  newPassword: z.string().min(5)
})