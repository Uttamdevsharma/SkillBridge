import "dotenv/config"
import { z } from "zod"

const envSchema = z.object({
  PORT: z.string(),
  DATABASE_URL: z.string(),
  AUTH_SECRET: z.string(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error("Invalid environment variables")
  process.exit(1)
}

export const env = parsed.data