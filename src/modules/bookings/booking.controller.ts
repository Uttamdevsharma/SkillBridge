import { Request, Response, NextFunction } from "express"
import { bookingService } from "./booking.service"
import { createBookingValidation } from "./booking.validation"

const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = createBookingValidation.parse(req.body)
    const result = await bookingService.createBooking(req.user!.userId, validated)

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getMyBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await bookingService.getMyBookings(req.user!.userId)
    res.json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

const getBookingHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await bookingService.getBookingHistory(req.user!.userId)
    res.json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

const cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await bookingService.cancelBooking(req.user!.userId, req.params.id as string)
    res.json({ success: true, message: "Booking cancelled successfully" })
  } catch (error) {
    next(error)
  }
}

export const bookingController = {
  createBooking,
  getMyBookings,
  getBookingHistory,
  cancelBooking
}