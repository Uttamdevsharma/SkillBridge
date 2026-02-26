import { Router } from "express"
import { tutorController } from "./tutor.controller"
import { allowRoles, requireAuth } from "../../middleware/auth.middleware"


const tutorRouter = Router()

tutorRouter.get("/tutors", tutorController.getTutors)

tutorRouter.get("/tutors/:id", tutorController.getTutorDetails)

tutorRouter.get("/categories", tutorController.getCategories)

tutorRouter.get("/tutors/dashboard",requireAuth,allowRoles("TUTOR"), tutorController.dashboard)

tutorRouter.get("/tutors/profile",requireAuth,allowRoles("TUTOR"), tutorController.getProfile)
tutorRouter.put("/tutors/profile", requireAuth,allowRoles("TUTOR"),tutorController.upsertProfile)

tutorRouter.post("/tutors/subjects",requireAuth,allowRoles("TUTOR"), tutorController.addSubjects)
tutorRouter.delete("/tutors/subjects/:categoryId",requireAuth,allowRoles("TUTOR"), tutorController.removeSubject)
tutorRouter.get("/tutors/subjects", requireAuth,allowRoles("TUTOR"),tutorController.getSubjects)

tutorRouter.post("/tutors/slots",requireAuth,allowRoles("TUTOR"), tutorController.createSlot)
tutorRouter.get("/tutors/slots", requireAuth,allowRoles("TUTOR"),tutorController.getSlots)
tutorRouter.delete("/tutors/slots/:slotId",requireAuth,allowRoles("TUTOR"), tutorController.deleteSlot)

tutorRouter.get("/tutors/bookings",requireAuth,allowRoles("TUTOR"), tutorController.getBookings)
tutorRouter.patch("/tutors/bookings/:id/complete", requireAuth,allowRoles("TUTOR"),tutorController.markComplete)

tutorRouter.get("/tutors/reviews",requireAuth,allowRoles("TUTOR"), tutorController.getReviews)

export default tutorRouter