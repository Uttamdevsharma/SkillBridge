import { Request, Response, NextFunction } from "express"
import { tutorService } from "./tutor.service"
import {
  profileUpsertValidation,
  addSubjectsValidation,
  createSlotValidation
} from "./tutor.validation"


const getTutors = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await tutorService.getTutors(req.query)
      res.json({ success: true, data })
    } catch (err) {
      next(err)
    }
  }
  
  const getTutorDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await tutorService.getTutorDetails(req.params.id as string)
      res.json({ success: true, data })
    } catch (err) {
      next(err)
    }
  }
  
  const getCategories = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await tutorService.getCategories()
      res.json({ success: true, data })
    } catch (err) {
      next(err)
    }
  }

const dashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await tutorService.dashboard(req.user!.userId)
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await tutorService.getProfile(req.user!.userId)
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

const upsertProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = profileUpsertValidation.parse(req.body)
    const data = await tutorService.upsertProfile(req.user!.userId, validated)
    res.json({ success: true, message: "Profile saved", data })
  } catch (err) { next(err) }
}

const addSubjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = addSubjectsValidation.parse(req.body)
    await tutorService.addSubjects(req.user!.userId, validated.categoryIds)
    res.json({ success: true, message: "Subjects added" })
  } catch (err) { next(err) }
}

const removeSubject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await tutorService.removeSubject(req.user!.userId, req.params.categoryId  as string)
    res.json({ success: true, message: "Subject removed" })
  } catch (err) { next(err) }
}

const getSubjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await tutorService.getSubjects(req.user!.userId)
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

const createSlot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = createSlotValidation.parse(req.body)
    const data = await tutorService.createSlot(req.user!.userId, validated)
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

const getSlots = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await tutorService.getSlots(req.user!.userId)
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

const deleteSlot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await tutorService.deleteSlot(req.user!.userId, req.params.slotId as string)
    res.json({ success: true, message: "Slot deleted" })
  } catch (err) { next(err) }
}

const getBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await tutorService.getBookings(req.user!.userId)
    res.json({ success: true, data })
  } catch (err) { next(err) }
}


const markComplete = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await tutorService.markComplete(req.user!.userId, req.params.id as string)
    res.json({ success: true, message: "Session completed" })
  } catch (err) { next(err) }
}

const getReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await tutorService.getReviews(req.user!.userId)
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

export const tutorController = {
  getTutors,
  getTutorDetails,
  getCategories,  
  dashboard,
  getProfile,
  upsertProfile,
  addSubjects,
  removeSubject,
  getSubjects,
  createSlot,
  getSlots,
  deleteSlot,
  getBookings,
  markComplete,
  getReviews
}