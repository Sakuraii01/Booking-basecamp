import { NextResponse } from "next/server";
import { getAllRoomSchedules, deleteRoomSchedule } from "./query";

export async function GET() {
  try {
    const schedules = await getAllRoomSchedules();
    return NextResponse.json(schedules);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id } = await req.json();
    await deleteRoomSchedule(id);

    return NextResponse.json({ status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
