import { prisma } from "@/src/lib/prisma";

export async function getRoomById(id: number) {
  return await prisma.room.findUnique({
    where: { id },
  });
}

export async function createRoom(name: string) {
  return await prisma.room.create({
    data: {
      name,
      // capacity,
    },
  });
}

// export async function updateRoom(id: number, name: string, capacity: number) {
//   return await prisma.room.update({
//     where: { id },
//     data: {
//       name,
//       capacity,
//     },
//   });
// }

export async function deleteRoom(id: number) {
  return await prisma.room.delete({
    where: { id },
  });
}

export async function getAllRooms() {
  return await prisma.room.findMany();
}
