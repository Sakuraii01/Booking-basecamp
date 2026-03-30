// app/api/room/route.ts
export const runtime = "nodejs";

import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const rooms = await prisma.room.findMany();
  return NextResponse.json(rooms);
}

export async function POST(req: Request) {
  const body = await req.json();
  const room = await prisma.room.create({
    data: {
      name: body.name,
    },
  });

  return NextResponse.json(room);
}
