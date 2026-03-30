"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// 1. Move the logic into a "Content" component
const CancleContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [status, setStatus] = useState<number | null>(null);

  useEffect(() => {
    const requestDelete = async () => {
      if (!token) return;

      const res = await fetch(`/api/room_schedule/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token,
          status: "CANCELLED",
        }),
      });
      setStatus(res.status);
    };

    requestDelete();
  }, [token]);

  return (
    <div
      className="w-72 bg-white rounded-3xl p-5 mx-auto text-center
                 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-xl"
    >
      <h1 className="text-2xl font-semibold text-neutral-700">
        {status === 200
          ? "Booking cancelled"
          : status === null
          ? "Processing..."
          : "Booking not found"}
      </h1>

      <img
        src={status === 200 ? "/booking-logo.png" : "/404-icon.png"}
        className="h-40 mx-auto mt-10 mb-5"
        alt="Status Icon"
      />

      {status !== 200 && status !== null && (
        <p className="text-sm font-semibold text-neutral-500">
          Whoops! <br />
          This booking doesn't exist or link is invalid.
        </p>
      )}

      <button
        onClick={() => router.push("/")}
        className="mt-4 border-2 border-neutral-800 rounded-full py-2 w-full text-neutral-800 hover:bg-neutral-100 transition"
      >
        Back to home
      </button>
    </div>
  );
};

// 2. The main export just wraps the content in Suspense
export default function CanclePage() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <CancleContent />
    </Suspense>
  );
}
