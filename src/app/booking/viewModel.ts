"use client";
import { useState, useEffect } from "react";

const useViewModel = () => {
  const [rooms, setRooms] = useState<
    { id: number; name: string; capacity: number }[]
  >([]);
  const [bookedTimes, setBookedTimes] = useState<
    {
      id: number;
      roomId: number;
      email: string;
      tel: string;
      date: string;
      startTime: string;
      endTime: string;
      status: string;
    }[]
  >([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const fetchRooms = async () => {
    const response = await fetch(`/api/room`);
    const data = await response.json();
    setRooms(data);
  };
  const fetchBookedTimes = async (roomId: number, date: Date) => {
    const response = await fetch(
      `/api/room_schedule/${roomId}?date=${date.toISOString()}`
    );
    const data = await response.json();
    setBookedTimes(data);
    console.log("Fetched booked times:", bookedTimes);
  };
  const handleChangeIsSubmit = (value: boolean) => {
    setIsSubmit(value);
  };
  const handleChangeLoading = (value: boolean) => {
    setLoading(value);
  };
  useEffect(() => {
    fetchRooms();
  }, []);

  return {
    isSubmit,
    rooms,
    bookedTimes,
    loading,
    fetchBookedTimes,
    handleChangeIsSubmit,
    handleChangeLoading,
  };
};

export default useViewModel;
