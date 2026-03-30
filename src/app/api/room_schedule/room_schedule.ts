import { prisma } from "@/src/lib/prisma";
export async function getRoomScheduleById(id: number) {
  return await prisma.booking.findUnique({
    where: { id },
    include: { room: true },
  });
}
export async function getRoomSchedulesByRoomId(roomId: number) {
  return await prisma.booking.findMany({
    where: { roomId },
  });
}
export async function getRoomSchedulesByDate(date: Date) {
  const bookings = await prisma.room.findMany({
    include: {
      bookings: {
        where: { date: date, status: "CONFIRMED" },
        orderBy: { startTime: "asc" },
      },
    },
  });

  return bookings;
}
export async function getRoomSchedulesByDateAndRoomId(
  date: Date,
  roomId: number
) {
  return await prisma.booking.findMany({
    where: { date, roomId, status: "CONFIRMED" },
  });
}
export async function getRoomSchedulesByEmail(email: string) {
  return await prisma.booking.findMany({
    where: { email, status: "CONFIRMED" },
    include: { room: true },
  });
}
export async function getRoomSchedulesByTel(tel: string) {
  return await prisma.booking.findMany({
    where: { tel, status: "CONFIRMED" },
    include: { room: true },
  });
}
export async function getAllRoomSchedules() {
  return await prisma.booking.findMany();
}
export async function createRoomSchedule(
  roomId: number,
  email: string,
  tel: string,
  date: string,
  startTime: string,
  endTime: string,
  numberOfAttendees: number,
  details: string,
  company: string,
  name: string
) {
  try {
    const dateOnly = new Date(`${date}`);
    console.log("dateOnly:", dateOnly, ":", date);

    const startDateTime = new Date(`${startTime}`);
    const endDateTime = new Date(`${endTime}`);

    if (
      isNaN(dateOnly.getTime()) ||
      isNaN(startDateTime.getTime()) ||
      isNaN(endDateTime.getTime())
    ) {
      throw new Error("Invalid date or time");
    }

    if (endDateTime <= startDateTime) {
      throw new Error("End time must be after start time");
    }

    return await prisma.booking.create({
      data: {
        roomId,
        email,
        tel,
        date: dateOnly,
        startTime: startDateTime,
        endTime: endDateTime,
        status: "PENDING",
        numberOfAttendees,
        details,
        company,
        name,
      },
    });
  } catch (error) {
    console.error("Error creating room schedule:", error);
    throw error;
  }
}

export async function updateRoomSchedule(
  id: number,
  roomId: number,
  email: string,
  tel: string,
  date: Date,
  startTime: Date,
  endTime: Date,
  status: "CONFIRMED" | "PENDING" | "CANCELLED"
) {
  return await prisma.booking.update({
    where: { id },
    data: {
      roomId,
      email,
      tel,
      date,
      startTime,
      endTime,
      status,
    },
  });
}
export async function updateRoomScheduleStatus(
  id: number,
  status: "CONFIRMED" | "PENDING" | "CANCELLED"
) {
  console.log("asd");

  return await prisma.booking.update({ where: { id }, data: { status } });
}

export async function createBookingConfirmations(
  bookingId: number,
  token: string
) {
  return await prisma.bookingConfirmations.create({
    data: { bookingId, token },
  });
}
export async function deleteBookingComfirmations(id: number) {
  return await prisma.bookingConfirmations.delete({ where: { id } });
}
