"use client";
import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";

const useViewModel = () => {
  const listRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [roomSelected, setRoomSelected] = useState<any | null>(null);
  const [isOpenCalendar, setIsOpenCalendar] = useState<boolean>(false);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const todayDate = today.getDate();
  // const daysInMonth = new Date(year, month + 1, 0).getDate();

  const [selectMonth, setSelectMonth] = useState<number>(month);
  const [selectYear, setSelectYear] = useState<number>(year);
  const [daysInMonth, setDaysInMonth] = useState<number>(
    new Date(year, month + 1, 0).getDate()
  );

  const [rooms, setRooms] = useState<any[]>([]);

  const scrollToCenter = (index: number) => {
    const container = listRef.current;
    const item = itemRefs.current[index];

    if (!container || !item) return;

    const containerWidth = container.offsetWidth;
    const itemLeft = item.offsetLeft;
    const itemWidth = item.offsetWidth;

    const scrollLeft = itemLeft - containerWidth / 2 + itemWidth / 2;

    container.scrollTo({
      left: scrollLeft,
      behavior: "smooth",
    });
  };
  const timeToMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };
  const handleChangeSelectedDay = (day: number) => {
    setSelectedDay(day);
  };
  const handleChangeRoomIdSelected = async (id: number | null) => {
    if (id) {
      const response = await fetch(`/api/room_schedule/booking/${id}`);
      const data = await response.json();
      setRoomSelected(data);
    } else {
      setRoomSelected(null);
    }
  };

  const fetchRooms = async (date: Date | string) => {
    const response = await fetch(
      `/api/room_schedule?date=${dayjs(date).toISOString()}`
    );
    const data = await response.json();
    setRooms(data);
  };
  const handelChangeMonthYear = (month: number, year: number) => {
    setSelectMonth(month);
    setSelectYear(year);
    setDaysInMonth(new Date(year, month + 1, 0).getDate());
    fetchRooms(new Date(year, month, 1));
  };

  const handleChangeOpenCalendar = (value: boolean) => {
    setIsOpenCalendar(value);
  };

  useEffect(() => {
    const todayIndex = todayDate - 1;
    setSelectedDay(todayDate);
    setSelectMonth(month);
    setSelectYear(year);

    // wait for DOM to render
    requestAnimationFrame(() => {
      scrollToCenter(todayIndex);
    });

    fetchRooms(dayjs().startOf("day").toDate());
  }, []);

  return {
    listRef,
    itemRefs,
    selectedDay,
    daysInMonth,
    todayDate,
    selectMonth,
    selectYear,
    // month,
    // year,
    rooms,
    roomSelected,
    isOpenCalendar,
    handleChangeSelectedDay,
    timeToMinutes,
    scrollToCenter,
    fetchRooms,
    handleChangeRoomIdSelected,
    handelChangeMonthYear,
    handleChangeOpenCalendar,
  };
};
export default useViewModel;
