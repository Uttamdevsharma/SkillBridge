import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { z } from "zod"

import { registerSchema, loginSchema, changePasswordSchema } from "./auth.validation"
import { AppError } from "../../utils/error/AppError"
import { env } from "../../config/env"
import { prisma } from "../../lib/prisma"

type RegisterInput = z.infer<typeof registerSchema>
type LoginInput = z.infer<typeof loginSchema>
type ChangePasswordInput = z.infer<typeof changePasswordSchema>

const userRegister = async (payload: RegisterInput) => {

    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email }
    })
  
    if (existingUser) {
      throw new AppError(400, "Email already in use")
    }
  
    const hashedPassword = await bcrypt.hash(payload.password, 10)
  
    const newUser = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        role: payload.role
      }
    })
  
    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      env.AUTH_SECRET,
      { expiresIn: "7d" }
    )
  
    return {
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    }
  }

const userLogin = async (payload: LoginInput) => {

  const foundUser = await prisma.user.findUnique({
    where: { email: payload.email }
  })

  if (!foundUser) {
    throw new AppError(401, "Invalid credentials")
  }

  if (foundUser.isBanned) {
    throw new AppError(403, "Account is restricted")
  }

  const passwordMatch = await bcrypt.compare(
    payload.password,
    foundUser.password
  )

  if (!passwordMatch) {
    throw new AppError(401, "Invalid credentials")
  }

  const accessToken = jwt.sign(
    { userId: foundUser.id, role: foundUser.role },
    env.AUTH_SECRET,
    { expiresIn: "7d" }
  )

  return {
    token: accessToken,
    user: {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role
    }
  }
}

const fetchCurrentUser = async (userId: string) => {

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  })
  if (!user) {
    throw new AppError(404, "User not found")
  }

  return user
}

const changeUserPassword = async (
  userId: string,
  payload: ChangePasswordInput
) => {

  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    throw new AppError(404, "User not found")
  }

  const isOldCorrect = await bcrypt.compare(
    payload.oldPassword,
    user.password
  )

  if (!isOldCorrect) {
    throw new AppError(401, "Old password is incorrect")
  }

  const newEncryptedPassword = await bcrypt.hash(payload.newPassword, 10)

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: newEncryptedPassword
    }
  })
}

export const authService = {
  userRegister,
  userLogin,
  fetchCurrentUser,
  changeUserPassword
}