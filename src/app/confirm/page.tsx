// app/cancle/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// 1. The Content Component (where the logic lives)
function CancelConfirmation() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token"); // Getting the token properly
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requestUpdate = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/room_schedule/status`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: token,
            status: "CONFIRMED",
          }),
        });
        setStatus(res.status);
      } catch (err) {
        setStatus(500);
      } finally {
        setLoading(false);
      }
    };

    requestUpdate();
  }, [token]);

  if (loading) return <div className="text-center mt-20">Verifying...</div>;

  return (
    <div className="w-80 bg-white rounded-3xl shadow-xl p-8 mx-auto text-center mt-20">
      <h1 className="text-2xl font-bold text-neutral-800">
        {status === 200
          ? "Booking Confirmed!"
          : status === 409
          ? "Time Slot Taken"
          : "Invalid Link"}
      </h1>

      <img
        src={
          status === 200
            ? "/booking-logo.png"
            : status === 409
            ? "/conflics-icon.png"
            : "/404-icon.png"
        }
        className="h-32 mx-auto my-6 object-contain"
        alt="Status Icon"
      />

      <div className="mb-6">
        {status === 200 ? (
          <p className="text-sm text-neutral-500">
            Your reservation is now secured. We look forward to seeing you!
          </p>
        ) : status === 409 ? (
          <p className="text-sm text-neutral-500">
            Someone else confirmed this slot first. <br />
            Please try another time.
          </p>
        ) : (
          <p className="text-sm text-neutral-500">
            We couldn't find this booking. It may have expired or been used.
          </p>
        )}
      </div>

      <button
        onClick={() => router.push("/")}
        className="w-full py-3 bg-neutral-900 text-white rounded-full font-semibold hover:bg-neutral-800 transition-colors"
      >
        Back to Home
      </button>
    </div>
  );
}

// 2. The Page Wrapper (The Suspense Boundary)
export default function ConfirmPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <Suspense fallback={<div className="text-neutral-500">Loading...</div>}>
        <CancelConfirmation />
      </Suspense>
    </div>
  );
}
