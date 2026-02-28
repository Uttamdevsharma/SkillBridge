import { Booking, Prisma, Review } from "../../../generated/prisma/client";
import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

import { AppError } from "../../utils/error/AppError";

const getTutors = async (query: any) => {
  const { search, category, minRate, maxRate } = query;

  const where: Prisma.TutorProfileWhereInput = {};

  if (search) {
    where.user = {
      name: {
        contains: search,
        mode: "insensitive",
      },
    };
  }

  if (minRate || maxRate) {
    where.hourlyRate = {
      gte: minRate ? Number(minRate) : undefined,
      lte: maxRate ? Number(maxRate) : undefined,
    };
  }

  if (category) {
    where.tutorCategories = {
      some: {
        OR: [
          { categoryId: category },
          {
            category: {
              name: {
                equals: category,
                mode: "insensitive",
              },
            },
          },
        ],
      },
    };
  }

  const tutors = await prisma.tutorProfile.findMany({
    where,
    include: {
      user: {
        select: { id: true, name: true },
      },
      tutorCategories: {
        include: {
          category: true,
        },
      },
      reviews: true,
    },
  });

  return tutors.map((tutor) => {
    const reviews = (tutor as any).reviews || [];
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) /
          reviews.length
        : 0;
    return {
      ...tutor,
      averageRating: Number(averageRating.toFixed(1)),
    };
  });
};


const getTutorDetails = async (id: string) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      tutorCategories: {
        include: { category: true },
      },
      reviews: {
        include: {
          student: {
            select: { name: true },
          },
        },
      },
    },
  });

  if (!tutor) {
    throw new AppError(404, "Tutor not found");
  }

  const reviews = (tutor as any).reviews || [];
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) /
        reviews.length
      : 0;

  const slots = await prisma.availabilitySlot.findMany({
    where: {
      tutorProfileId: id,
      isBooked: false,
    },
    include: {
      category: true,
    },
  });

  return {
    tutor: {
      ...tutor,
      averageRating: Number(averageRating.toFixed(1)),
    },
    slots,
  };
};

const getCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
};

const getProfile = async (userId: string) => {
  return prisma.tutorProfile.findUnique({
    where: { userId },
    include: {
      tutorCategories: { include: { category: true } },
    },
  });
};

const upsertProfile = async (userId: string, data: any) => {
  return prisma.tutorProfile.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  });
};

const addSubjects = async (userId: string, categoryIds: string[]) => {
  const profile = await prisma.tutorProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError(400, "Create profile first");

  await prisma.tutorCategory.createMany({
    data: categoryIds.map((id) => ({
      tutorId: profile.id,
      categoryId: id,
    })),
    skipDuplicates: true,
  });
};

const removeSubject = async (userId: string, categoryId: string) => {
  const profile = await prisma.tutorProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError(400, "Profile not found");

  await prisma.tutorCategory.delete({
    where: {
      tutorId_categoryId: {
        tutorId: profile.id,
        categoryId,
      },
    },
  });
};

const getSubjects = async (userId: string) => {
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId },
    include: {
      tutorCategories: { include: { category: true } },
    },
  });
  return profile?.tutorCategories || [];
};

const createSlot = async (userId: string, data: any) => {
  const profile = await prisma.tutorProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError(400, "Complete profile first");

  return prisma.availabilitySlot.create({
    data: {
      tutorProfileId: profile.id,
      categoryId: data.categoryId,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
    },
  });
};

const getSlots = async (userId: string) => {
  const profile = await prisma.tutorProfile.findUnique({ where: { userId } });
  if (!profile) return [];
  return prisma.availabilitySlot.findMany({
    where: { tutorProfileId: profile.id },
  });
};

const deleteSlot = async (userId: string, slotId: string) => {
  const slot = await prisma.availabilitySlot.findUnique({
    where: { id: slotId },
  });
  if (!slot || slot.isBooked)
    throw new AppError(400, "Cannot delete booked slot");
  await prisma.availabilitySlot.delete({ where: { id: slotId } });
};

const getBookings = async (userId: string) => {
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    return [];
  }

  return prisma.booking.findMany({
    where: { tutorProfileId: profile.id },
    include: {
      student: true,
      slot: true,
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const markComplete = async (userId: string, bookingId: string) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (!tutorProfile) {
    throw new AppError(404, "Tutor profile not found");
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  if (booking.tutorProfileId !== tutorProfile.id) {
    throw new AppError(403, "You can only complete your own sessions");
  }

  if (booking.status !== BookingStatus.CONFIRMED) {
    throw new AppError(400, "Only confirmed sessions can be completed");
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: BookingStatus.COMPLETED },
  });
};

const getReviews = async (userId: string) => {
  const profile = await prisma.tutorProfile.findUnique({ where: { userId } });
  if (!profile) return [];
  return prisma.review.findMany({
    where: { tutorProfileId: profile.id },
  });
};

const dashboard = async (userId: string) => {
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    return {
      totalSessions: 0,
      completedSessions: 0,
      upcomingSessions: 0,
      uniqueStudents: 0,
      averageRating: 0,
    };
  }

  const bookings: Booking[] = await prisma.booking.findMany({
    where: { tutorProfileId: profile.id },
  });

  const reviews: Review[] = await prisma.review.findMany({
    where: { tutorProfileId: profile.id },
  });

  const uniqueStudents = new Set(bookings.map((b: Booking) => b.studentId))
    .size;

  const completedSessions = bookings.filter(
    (b: Booking) => b.status === BookingStatus.COMPLETED,
  ).length;

  const upcomingSessions = bookings.filter(
    (b: Booking) => b.status === BookingStatus.CONFIRMED,
  ).length;

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc: number, r: Review) => acc + r.rating, 0) /
        reviews.length
      : 0;

  return {
    totalSessions: bookings.length,
    completedSessions,
    upcomingSessions,
    uniqueStudents,
    averageRating,
  };
};

export const tutorService = {
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
  getReviews,
};
