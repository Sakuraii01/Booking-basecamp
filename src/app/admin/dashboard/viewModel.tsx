"use client";
import { useState, useEffect } from "react";
import { fetchApi } from "@/src/utils/api";

const useViewModel = () => {
  const [rooms, setRooms] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<any[]>([]);

  const fetchData = async () => {
    await fetchApi("/api/admin/room", { method: "GET" })
      .then(async (res) => {
        setLoading(true);
        if (res.status === 200) {
          const result = await res.json();
          setRooms(result);
        }
      })
      .finally(() => setLoading(false));
    await fetchApi("/api/admin/user", { method: "GET" })
      .then(async (res) => {
        setLoading(true);
        if (res.status === 200) {
          const result = await res.json();
          setUserData(result);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { loading, rooms, userData, fetchData };
};
export default useViewModel;
