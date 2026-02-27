import { Request, Response, NextFunction } from "express"
import { reviewService } from "./review.service"
import {
  createReviewValidation,
  updateReviewValidation
} from "./review.validation"

const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = createReviewValidation.parse(req.body)
    const result = await reviewService.createReview(req.user!.userId, validated)

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const updateReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = updateReviewValidation.parse(req.body)
    const result = await reviewService.updateReview(
      req.user!.userId,
      req.params.id as string,
      validated
    )

    res.json({
      success: true,
      message: "Review updated successfully",
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await reviewService.deleteReview(req.user!.userId, req.params.id as string)

    res.json({
      success: true,
      message: "Review deleted successfully"
    })
  } catch (error) {
    next(error)
  }
}

const getMyReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await reviewService.getMyReviews(req.user!.userId)
    res.json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}





export const reviewController = {
  createReview,
  updateReview,
  deleteReview,
  getMyReviews
}