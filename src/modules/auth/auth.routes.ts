import express from "express"
import { authController } from "./auth.controller"
import { requireAuth } from "../../middleware/auth.middleware"


const authRouter = express.Router()

authRouter.post("/register", authController.userRegister)
authRouter.post("/login", authController.userLogin)
authRouter.get("/me", requireAuth, authController.getCurrentUser)
authRouter.patch("/change-password", requireAuth, authController.updatePassword)

export default authRouter