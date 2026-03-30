import { NextResponse } from "next/server";
import {
  createBookingConfirmations,
  getRoomScheduleById,
} from "../room_schedule";
import { GenerateToken } from "../../common";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;
    const token = await GenerateToken();
    const confirmLink = `https://booking.urbandata-th.com/cancle?token=${token}`;
    const resend = new Resend(process.env.RESEND_API_KEY);

    const bookingData = await getRoomScheduleById(id);
    if (!bookingData) {
      return NextResponse.json(
        { error: "This id doesn't have in database" },
        { status: 400 },
      );
    }
    const dateObj = new Date(bookingData.date);
    const startTimeObj = new Date(bookingData.startTime);
    const endTimeObj = new Date(bookingData.endTime);

    const dateFormatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const timeFormatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Bangkok",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const gmt7Date = dateFormatter.format(dateObj); // YYYY-MM-DD
    const startTimeParts = timeFormatter.format(startTimeObj); // HH:mm
    const endTimeParts = timeFormatter.format(endTimeObj); // HH:mm
    try {
      (async function () {
        const { data, error } = await resend.emails.send({
          from: `URBooking <contact@urbandata-th.com>`,
          to: [bookingData.email],
          subject: "Booking cancellation",
          html: `<h1>Booking cancellation</h1>
            <p>Your cancellation has to be confirmed. Please review your booking information.</p>
            <p>Booking Details:</p>
              <ul>
                <li><strong>Room:</strong> ${bookingData?.room.name}</li>
                <li><strong>Date:</strong> ${gmt7Date} GMT+7</li>
                <li><strong>Time:</strong> ${startTimeParts} - ${endTimeParts} GMT+7</li>
                <li><strong>Company:</strong> ${bookingData.company}</li>
              </ul>
              <p>Please confirm your cancellation</p>
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
                    Cancel Booking
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

    await createBookingConfirmations(Number(id), token);
    return NextResponse.json({ status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
