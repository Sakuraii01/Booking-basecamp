import { NextResponse } from "next/server";
import { getRoomScheduleById } from "../../room_schedule";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params; // unwrap the Promise
    const bookingId = Number(resolvedParams.id); // now it's valid

    if (isNaN(bookingId)) {
      return NextResponse.json(
        { error: "Invalid bookingId parameter" },
        { status: 400 }
      );
    }
    const schedules = await getRoomScheduleById(bookingId);

    return NextResponse.json(schedules);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
