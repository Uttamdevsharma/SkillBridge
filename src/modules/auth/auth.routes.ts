import express from "express"
import { authController } from "./auth.controller"
const authRouter = express.Router()


authRouter.post("/register",authController.userRegister)
authRouter.post("/login",)

export  default authRouter