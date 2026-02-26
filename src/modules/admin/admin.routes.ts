import { Router } from "express"
import { adminController } from "./admin.controller"
import { allowRoles, requireAuth } from "../../middleware/auth.middleware"


const adminRouter = Router()

adminRouter.get("/analytics", requireAuth,allowRoles("ADMIN"),adminController.getDashboardStats)

adminRouter.get("/users",requireAuth,allowRoles("ADMIN"),adminController.getAllUsers)

adminRouter.patch("/users/:id",requireAuth,allowRoles("ADMIN"),adminController.updateUserStatus)

adminRouter.get( "/bookings", requireAuth, allowRoles("ADMIN"), adminController.getAllBookings)

adminRouter.post("/categories",requireAuth,allowRoles("ADMIN"),adminController.createCategory)

adminRouter.patch("/categories/:id",requireAuth,allowRoles("ADMIN"),adminController.updateCategory)

adminRouter.delete("/categories/:id",requireAuth,allowRoles("ADMIN"),adminController.deleteCategory)



export default adminRouter