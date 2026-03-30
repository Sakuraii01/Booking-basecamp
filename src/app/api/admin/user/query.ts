import { prisma } from "@/src/lib/prisma";

export async function getUser() {
  return await prisma.user.findMany();
}

export async function createUser(
  email: string,
  name: string,
  password: string,
  role: "ADMIN" | "USER"
) {
  return await prisma.user.create({
    data: {
      email,
      name,
      password,
      role: role,
    },
  });
}
export const updateUser = (id: number, data: any) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

export async function deleteUser(id: number) {
  return await prisma.user.delete({
    where: { id },
  });
}
