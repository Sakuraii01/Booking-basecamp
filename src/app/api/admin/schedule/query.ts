import { prisma } from "@/src/lib/prisma";

export async function getAllRoomSchedules() {
  return await prisma.booking.findMany({
    include: { room: true },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });
}

export async function deleteRoomSchedule(id: number) {
  return await prisma.booking.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
}
