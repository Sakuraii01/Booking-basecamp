import { NextResponse } from "next/server";
import {
  updateRoomScheduleStatus,
  deleteBookingComfirmations,
} from "../room_schedule";

import { prisma } from "@/src/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id, email, status } = body;

    const isBooking = await prisma.booking.findUnique({
      where: { id: id, email: email },
    });

    if (isBooking) {
      updateRoomScheduleStatus(id, status);
      return NextResponse.json({ status: 200 });
    }

    return NextResponse.json(
      { error: "This email not sync with booking id" },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { token, status } = await req.json();

    if (status !== "CONFIRMED" && status !== "CANCELLED") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    // 1. Validate Token
    const bookingToken = await prisma.bookingConfirmations.findFirst({
      where: { token },
      include: { booking: true },
    });

    if (!bookingToken || !bookingToken.booking) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const { booking } = bookingToken;

    if (status === "CONFIRMED") {
      if (!booking.startTime || !booking.endTime) {
        return NextResponse.json(
          { error: "Booking missing time data" },
          { status: 400 }
        );
      }

      const hasConflict = await checkBookingConflict(booking);
      if (hasConflict) {
        return NextResponse.json(
          { error: "This time slot is already taken." },
          { status: 409 } // 409 is better for conflicts
        );
      }
    }

    await prisma.$transaction([
      prisma.booking.update({
        where: { id: booking.id },
        data: { status: status },
      }),
      prisma.bookingConfirmations.delete({
        where: { id: bookingToken.id },
      }),
    ]);

    return NextResponse.json(
      { message: `Booking ${status.toLowerCase()} successfully` },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Update Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Helper function to keep the main route clean
async function checkBookingConflict(newBooking: any) {
  const confirmedBookings = await prisma.booking.findMany({
    where: {
      roomId: newBooking.roomId,
      date: newBooking.date,
      status: "CONFIRMED",
      id: { not: newBooking.id },
    },
  });

  const nStart = new Date(newBooking.startTime).getTime();
  const nEnd = new Date(newBooking.endTime).getTime();

  return confirmedBookings.some((existing: any) => {
    const eStart = new Date(existing.startTime).getTime();
    const eEnd = new Date(existing.endTime).getTime();
    return nStart < eEnd && nEnd > eStart;
  });
}
