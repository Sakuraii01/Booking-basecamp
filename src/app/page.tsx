"use client";

import { useRouter } from "next/navigation";
import {
  SearchRounded,
  AddRounded,
  PersonRounded,
  ApartmentRounded,
  CalendarMonthRounded,
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
  LocalPhoneRounded,
} from "@mui/icons-material";
import { DAY_NAMES, MONTH_NAMES } from "./constant";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers";

import dayjs from "dayjs";
import useViewModel from "./home/viewModel";

export default function Home() {
  const {
    listRef,
    itemRefs,
    selectedDay,
    daysInMonth,
    selectMonth,
    selectYear,
    rooms,
    roomSelected,
    isOpenCalendar,
    scrollToCenter,
    handleChangeSelectedDay,
    timeToMinutes,
    fetchRooms,
    handleChangeRoomIdSelected,
    handelChangeMonthYear,
    handleChangeOpenCalendar,
  } = useViewModel();
  const router = useRouter();

  return (
    <div>
      <main>
        {roomSelected && (
          <div className="fixed w-full h-full backdrop-blur-sm z-50 bg-neutral-400/40">
            <div className="fixed left-1/2 top-1/2 p-4 bg-white rounded-2xl max-w-xs w-full transform -translate-1/2 shadow-2xl">
              <img
                src={"/room_picture/image.png"}
                className="rounded-xl h-44 w-full image-cover"
              />
              <div className="py-2 flex justify-between border-b border-neutral-200">
                <h3 className="text-xl font-medium">
                  Room : {roomSelected.room.name}
                </h3>
                <div className="text-end text-sm">
                  <p className="my-1">
                    {dayjs(roomSelected.date).date()}{" "}
                    {MONTH_NAMES[dayjs(roomSelected.date).month()]}{" "}
                    {dayjs(roomSelected.date).year()}
                  </p>
                  <p className="bg-linear-to-r from-primary-1 to-primary-3 w-fit rounded-full text-white px-2">
                    {dayjs(roomSelected.startTime).format("HH:mm")} -{" "}
                    {dayjs(roomSelected.endTime).format("HH:mm")}
                  </p>
                </div>
              </div>

              <div className="my-4">
                <div className="flex gap-2 items-center my-2">
                  <div className="bg-linear-to-br from-primary-1 from-50% to-primary-3 rounded-full">
                    <PersonRounded
                      className="m-1 text-white"
                      fontSize="small"
                    />
                  </div>
                  <p>Name : {roomSelected?.name || "-"} </p>
                </div>
                <div className="flex gap-2 items-center my-2">
                  <div className="bg-linear-to-br from-primary-1 from-50% to-primary-3 rounded-full">
                    <ApartmentRounded
                      className="m-1 text-white"
                      fontSize="small"
                    />
                  </div>
                  <p>Company : {roomSelected?.company || "-"} </p>
                </div>
                <div className="flex gap-2 items-center my-2">
                  <div className="bg-linear-to-br from-primary-1 from-50% to-primary-3 rounded-full">
                    <LocalPhoneRounded
                      className="m-1 text-white"
                      fontSize="small"
                    />
                  </div>
                  <p>Tel : {roomSelected?.tel || "-"} </p>
                </div>
              </div>
              <button
                className="w-full rounded-xl py-2 bg-primary-3 text-white"
                onClick={() => handleChangeRoomIdSelected(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
        <section className="pt-4 pb-6 bg-white shadow-lg sticky top-0 z-30 rounded-b-[55px]">
          <div className="w-10/12 mx-auto flex items-center justify-between gap-2 border-b border-neutral-200 pt-3 pb-5">
            <div className="flex gap-2 items-center">
              <img src={"./image.png"} className="h-7 mx-auto" />
              x
              <img src={"./urban-logo.png"} className="h-8 mx-auto" />
            </div>
            {/* <p className="text-xl">
              <span className="font-semibold">URB</span>ooking
            </p> */}
            <div
              className="bg-white rounded-full shadow-lg border border-neutral-200"
              onClick={() => router.push("search")}
            >
              <SearchRounded className="text-neutral-400 m-2" />
            </div>
          </div>
          <div className="w-fit ml-auto mr-4"></div>
          <div className="flex justify-between items-center max-w-xs mx-auto mt-6 relative">
            <div className="flex">
              <h2 className="text-3xl font-semibold text-neutral-700">
                {MONTH_NAMES[selectMonth]}, {selectYear}
              </h2>
              {!isOpenCalendar ? (
                <KeyboardArrowDownRounded
                  className="text-neutral-400 m-2"
                  onClick={() => handleChangeOpenCalendar(true)}
                />
              ) : (
                <KeyboardArrowUpRounded
                  className="text-neutral-400 m-2"
                  onClick={() => handleChangeOpenCalendar(false)}
                />
              )}
            </div>
            {isOpenCalendar ? (
              <div className="absolute bg-white rounded-2xl shadow-xl w-fit p-2 z-50 top-14">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar
                    views={["month", "year"]}
                    value={dayjs(
                      `${selectYear}-${String(selectMonth + 1).padStart(
                        2,
                        "0",
                      )}-01`,
                    )}
                    onChange={(newValue) => {
                      const date = new Date(
                        newValue!.year(),
                        newValue!.month(),
                        1,
                      );
                      handelChangeMonthYear(
                        date.getMonth(),
                        date.getFullYear(),
                      );
                      scrollToCenter(0);
                    }}
                    openTo="month"
                  />
                </LocalizationProvider>
              </div>
            ) : (
              ""
            )}
            <div className="w-fit">
              <button
                onClick={() => router.push("/booking")}
                className="bg-linear-to-r from-primary-1 to-primary-3 text-white px-4 py-2 rounded-xl shadow-lg flex gap-2 items-center"
              >
                <AddRounded />
                <p>Booking</p>
              </button>
            </div>
          </div>

          <div className="relative mb-3 mt-2">
            <div className="absolute w-14 h-3/4 bg-linear-to-r from-white to-transparent z-10 left-0 t-0"></div>
            <div className="absolute w-14 h-3/4 bg-linear-to-l from-white to-transparent z-10 right-0 t-0"></div>
            <ul
              className="flex gap-4 overflow-x-scroll relative px-20"
              ref={listRef}
            >
              {Array.from({ length: daysInMonth }, (_, i) => {
                const date = new Date(selectYear, selectMonth, i + 1);
                const dayOfWeek = DAY_NAMES[date.getDay()];

                return (
                  <li
                    key={i}
                    ref={(el) => {
                      itemRefs.current[i] = el;
                    }}
                    onClick={() => {
                      handleChangeSelectedDay(i + 1);
                      scrollToCenter(i);
                      fetchRooms(date);
                    }}
                    className="relative px-2 py-4 flex flex-col items-center cursor-pointer transition-all duration-200"
                  >
                    {/* BACKGROUND CIRCLE (always exists) */}
                    <div
                      className={`absolute top-7 w-8 h-8 rounded-full bg-primary-4 transition-all duration-200
                      ${
                        selectedDay === i + 1
                          ? "opacity-100 scale-100"
                          : "hidden"
                      }`}
                    />

                    {/* CONTENT */}
                    <div
                      className={`relative z-10 backdrop-blur-md text-center rounded-full py-2 px-1 transition-transform duration-200 
                        ${
                          selectedDay === i + 1
                            ? "text-white font-semibold scale-125"
                            : "opacity-70 text-primary-2"
                        }`}
                    >
                      <p className="text-xs">{dayOfWeek}</p>
                      <p className="w-9 text-center font-bold text-xl">
                        {i + 1}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
        <div className="w-11/12 mx-auto mt-7">
          {rooms.map((room) => (
            <div key={room.id} className="relative">
              <div className="w-full px-5 py-6 my-5 rounded-3xl bg-linear-10 from-white from-50% z-10">
                <div className="flex items-center gap-2 mt-10">
                  <div className="h-5 w-1 bg-neutral-400 rounded-full"></div>
                  <p className="text-neutral-600 font-medium text-lg">
                    Room : {room.name}
                  </p>
                </div>
                <CalendarMonthRounded className="text-primary-3/70 mb-1 mt-2" />
                <div className="w-full overflow-x-auto">
                  <div className="min-w-240">
                    {/* HOURS */}
                    <div className="grid grid-cols-24 text-xs text-center text-gray-500">
                      {Array.from({ length: 24 }, (_, i) => (
                        <div key={i} className="py-1 border-r border-gray-200">
                          {String(i).padStart(2, "0")}:00
                        </div>
                      ))}
                    </div>

                    {/* TIMELINE */}
                    <div className="relative h-6 bg-gray-100 rounded mt-1">
                      {room.bookings.map((booking: any, i: number) => {
                        const startMin = timeToMinutes(
                          dayjs(booking.startTime).format("HH:mm"),
                        );
                        const endMin = timeToMinutes(
                          dayjs(booking.endTime).format("HH:mm"),
                        );

                        const left = (startMin / 1440) * 100;
                        const width = ((endMin - startMin) / 1440) * 100;

                        return (
                          <div
                            key={i}
                            onClick={() => {
                              handleChangeRoomIdSelected(booking.id);
                            }}
                          >
                            <div
                              className="absolute h-full backdrop-blur-sm rounded cursor-pointer z-10"
                              style={{
                                left: `${left}%`,
                                width: `${width}%`,
                              }}
                            ></div>
                            <div
                              className="absolute h-1/2 top-1/2 transform -translate-y-1/2 bg-linear-to-r from-primary-1/80 to-primary-3/80 rounded cursor-pointer"
                              style={{
                                left: `${left}%`,
                                width: `${width - 1}%`,
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <img
                src={`/room_picture/${room.name + ".jpg"}`}
                className="absolute top-0 right-0 -z-10 rounded-3xl h-full w-full bg-linear-to-tr from-white bg-cover bg-no-repeat"
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
