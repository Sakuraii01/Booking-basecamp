import { NextResponse } from "next/server";
import {
  getRoomSchedulesByEmail,
  getRoomSchedulesByTel,
} from "../room_schedule";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    if (search) {
      const search_email = await getRoomSchedulesByEmail(search);

      return NextResponse.json(search_email);
    }

    return NextResponse.json(
      { error: "Missing search parameter" },
      { status: 400 }
    );
  } catch (err) {
    console.log(err);
  }
}
