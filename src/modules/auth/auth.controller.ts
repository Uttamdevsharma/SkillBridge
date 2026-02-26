import { Request, Response, NextFunction } from "express"
import { authService } from "./auth.service"
import { registerSchema, loginSchema, changePasswordSchema } from "./auth.validation"

const userRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedBody = registerSchema.parse(req.body)
    const result = await authService.userRegister(parsedBody)

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedBody = loginSchema.parse(req.body)
    const result = await authService.userLogin(parsedBody)

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result
    })
  } catch (error) {
    next(error)
  }
}


const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userInfo = await authService.fetchCurrentUser(req.user!.userId)

    res.json({
      success: true,
      data: userInfo
    })
  } catch (error) {
    next(error)
  }
}

const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedBody = changePasswordSchema.parse(req.body)

    await authService.changeUserPassword(req.user!.userId, parsedBody)

    res.json({
      success: true,
      message: "Password updated successfully"
    })
  } catch (error) {
    next(error)
  }
}

export const authController = {
  userRegister,
  userLogin,
  getCurrentUser,
  updatePassword
}