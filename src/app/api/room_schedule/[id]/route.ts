// app/api/room_schedule/[roomId]/route.ts
import { NextResponse } from "next/server";
import { getRoomSchedulesByDateAndRoomId } from "../room_schedule";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(req.url);
    const resolvedParams = await params; // unwrap the Promise
    const roomId = Number(resolvedParams.id); // now it's valid

    const dateParam = searchParams.get("date");

    if (isNaN(roomId)) {
      return NextResponse.json(
        { error: "Invalid roomId parameter" },
        { status: 400 }
      );
    }

    if (!dateParam) {
      return NextResponse.json(
        { error: "Missing date parameter" },
        { status: 400 }
      );
    }

    const date = new Date(dateParam);

    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: "Invalid date parameter" },
        { status: 400 }
      );
    }

    const schedules = await getRoomSchedulesByDateAndRoomId(date, roomId);

    return NextResponse.json(schedules);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
