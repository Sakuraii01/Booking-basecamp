"use client";
import { useState, useEffect } from "react";
import { fetchApi } from "@/src/utils/api";

const useViewModel = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [roomSchedules, setRoomSchedules] = useState<any[]>([]);

  const fetchData = async () => {
    await fetchApi("/api/admin/schedule", { method: "GET" })
      .then(async (res) => {
        setLoading(true);
        if (res.status === 200) {
          const result = await res.json();
          setRoomSchedules(result);
        }
      })
      .finally(() => setLoading(false));
  };
  const handleOnCancleBooking = async (id: number) => {
    await fetchApi(
      "/api/admin/schedule",
      {
        method: "PUT",
      },
      { id: id }
    )
      .then(async (res) => {
        setLoading(true);
        if (res.status === 200) {
          await fetchData();
        }
      })
      .finally(() => setLoading(false));
  };
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleCancel = async (id: number) => {
    if (!confirm("Cancel this booking?")) return;
    await handleOnCancleBooking(id);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return {
    loading,
    roomSchedules,
    handleOnCancleBooking,
    formatTime,
    handleCancel,
  };
};
export default useViewModel;
