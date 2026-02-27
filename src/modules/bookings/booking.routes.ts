import { Router } from "express"
import { bookingController } from "./booking.controller"
import { requireAuth, allowRoles } from "../../middleware/auth.middleware"

const bookingRouter = Router()


bookingRouter.post("/bookings",requireAuth,allowRoles("STUDENT"),bookingController.createBooking)

bookingRouter.get("/bookings",requireAuth,allowRoles("STUDENT"),bookingController.getMyBookings)

bookingRouter.get("/bookings/history",requireAuth,allowRoles("STUDENT"),bookingController.getBookingHistory)

bookingRouter.patch("/bookings/:id/cancel",requireAuth,allowRoles("STUDENT"),bookingController.cancelBooking)



export default bookingRouter