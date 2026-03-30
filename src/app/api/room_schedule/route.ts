import { NextResponse } from "next/server";
import {
  getAllRoomSchedules,
  createRoomSchedule,
  getRoomSchedulesByDate,
  createBookingConfirmations,
} from "./room_schedule";
import { GenerateToken } from "../common";
import { Resend } from "resend";
import { prisma } from "@/src/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dateParam = searchParams.get("date");

  if (dateParam) {
    const date = new Date(dateParam);
    const schedules = await getRoomSchedulesByDate(date);
    return NextResponse.json(schedules);
  }

  const schedules = await getAllRoomSchedules();
  return NextResponse.json(schedules);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const requiredFields = [
      "roomId",
      "email",
      "tel",
      "date",
      "startTime",
      "endTime",
      "numberOfAttendees",
      "details",
      "company",
      "name",
    ];
    const roomData = await prisma.room.findUnique({
      where: { id: Number(body.roomId) },
    });

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing field: ${field}` },
          { status: 400 }
        );
      }
    }

    const token = await GenerateToken();
    const confirmLink = `https://booking.urbandata-th.com/confirm?token=${token}`;
    const resend = new Resend(process.env.RESEND_API_KEY);
    const dateObj = new Date(body.date);
    const startTimeObj = new Date(body.startTime);
    const endTimeObj = new Date(body.endTime);

    const dateFormatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Bangkok",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const timeFormatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Bangkok",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const formattedDate = dateFormatter.format(dateObj); // 29/01/2026
    const startTimeParts = timeFormatter.format(startTimeObj); // 09:00
    const endTimeParts = timeFormatter.format(endTimeObj);
    try {
      (async function () {
        const { data, error } = await resend.emails.send({
          from: `URBooking <contact@urbandata-th.com>`,
          to: [body.email],
          subject: "Booking Confirmation",
          html: ` <h1>Booking Confirmation</h1>
          <p>Your reservation is pending. Please review your booking information.</p>
          <p>Booking Details:</p>
          <ul>
            <li><strong>Room:</strong> ${roomData?.name}</li>
            <li><strong>Date:</strong> ${formattedDate} GMT+7</li>
            <li><strong>Time:</strong> ${startTimeParts} - ${endTimeParts} GMT+7</li>
            <li><strong>Company:</strong> ${body.company}</li>
          </ul>
          <p>Please confirm your reservation.</p>
           <a
            href="${confirmLink}"
            style="
              display:inline-block;
              margin:12px 0;
              padding:12px 24px;
              background:linear-gradient(to right, #4f46e5, #a855f7);
              color:#ffffff;
              text-decoration:none;
              border-radius:8px;
              font-weight:600;
              font-size:14px;
            "
          >
            Confirm Booking
          </a>
          `,
        });

        if (error) {
          return console.error({ error });
        }

        console.log({ data });
      })();
    } catch (emailError) {
      console.error("Email failed to send:", emailError);
    }

    const schedule = await createRoomSchedule(
      body.roomId,
      body.email,
      body.tel,
      body.date,
      body.startTime,
      body.endTime,
      Number(body.numberOfAttendees),
      body.details,
      body.company,
      body.name
    );

    await createBookingConfirmations(Number(schedule.id), token);

    return NextResponse.json(schedule);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
