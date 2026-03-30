// app/api/room/route.ts
// export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getAllRooms } from "./room";

export async function GET() {
  const rooms = await getAllRooms();
  return NextResponse.json(rooms);
}
