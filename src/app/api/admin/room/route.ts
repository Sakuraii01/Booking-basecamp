import { NextResponse } from "next/server";
import { getAllRooms, createRoom, updateRoom, deleteRoom } from "./query";

export async function GET() {
  const rooms = await getAllRooms();
  return NextResponse.json({ message: "Admin Room API", rooms });
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const room = await createRoom(body.name);

    return NextResponse.json(room);
  } catch (err) {
    console.log(err);
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const room = await updateRoom(body.id, body.name);

    return NextResponse.json(room);
  } catch (err) {
    console.log(err);
  }
}

export async function DELETE(req: Request) {
  try {
    // const { searchParams } = new URL(req.url);
    const body = await req.json();

    if (body.id) {
      const room = await deleteRoom(Number(body.id));
      return NextResponse.json(room);
    }
    return NextResponse.json(
      { error: "Missing id parameter" },
      { status: 400 }
    );
  } catch (err) {
    console.log(err);
  }
}
