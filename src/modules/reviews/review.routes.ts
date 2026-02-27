import { Router } from "express"
import { reviewController } from "./review.controller"
import { requireAuth, allowRoles } from "../../middleware/auth.middleware"

const reviewRouter = Router()

reviewRouter.post("/reviews",requireAuth,allowRoles("STUDENT"),reviewController.createReview)
reviewRouter.get("/reviews/my",requireAuth,allowRoles("STUDENT"),reviewController.getMyReviews)

reviewRouter.patch("/reviews/:id",requireAuth,allowRoles("STUDENT"),reviewController.updateReview)

reviewRouter.delete("/reviews/:id",requireAuth,allowRoles("STUDENT"),reviewController.deleteReview)


export default reviewRouter