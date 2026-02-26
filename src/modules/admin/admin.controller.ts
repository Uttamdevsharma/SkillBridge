import { Request, Response, NextFunction } from "express"
import { adminService } from "./admin.service"

const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await adminService.fetchAnalytics()
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}


const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await adminService.fetchUsers(req.user!.userId)
    res.json({ success: true, data: users })
  } catch (error) {
    next(error)
  }
}

const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { action } = req.body
    await adminService.modifyUserStatus(req.params.id as string , action)
    res.json({ success: true, message: "User status updated" })
  } catch (error) {
    next(error)
  }
}

const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await adminService.fetchBookings()
    res.json({ success: true, data: bookings })
  } catch (error) {
    next(error)
  }
}

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await adminService.addCategory(req.body.name)
    res.status(201).json({ success: true, data: category })
  } catch (error) {
    next(error)
  }
}

const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await adminService.editCategory(req.params.id as string, req.body.name)
    res.json({ success: true, data: category })
  } catch (error) {
    next(error)
  }
}

const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await adminService.removeCategory(req.params.id  as string)
    res.json({ success: true, message: "Category deleted" })
  } catch (error) {
    next(error)
  }
}

export const adminController = {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getAllBookings,
  createCategory,
  updateCategory,
  deleteCategory
}