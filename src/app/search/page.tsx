"use client";
import { Header } from "../component/header";
import { SearchRounded } from "@mui/icons-material";
import { useState } from "react";
import dayjs from "dayjs";
import { MONTH_NAMES } from "../constant";
import { useRouter } from "next/navigation";
import { Backdrop, CircularProgress } from "@mui/material";
const Search = () => {
  const router = useRouter();
  const [searchResult, setSearchResult] = useState<any>([]);
  const [isCancle, setIsCancle] = useState(false);
  const [isSendmail, setIsSendmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const fetchSearchResult = async (value: string) => {
    await fetch(`/api/room_schedule/search?search=${value}`).then((res) => {
      if (res.status === 200) {
        return res.json().then((data) => setSearchResult(data));
      }
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const searchValue = formData.get("search");

    if (typeof searchValue === "string") {
      fetchSearchResult(searchValue);
    } else {
      fetchSearchResult("");
    }
  };
  return (
    <div>
      <Header header={"ค้นหาห้องประชุม"} />
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {isSendmail ? (
        <div className="fixed left-0 top-0 w-full h-full bg-black/30 z-50 backdrop-blur-sm">
          <div className="text-center absolute left-1/2 top-1/2 transform -translate-1/2 p-4 w-72 bg-white rounded-3xl">
            <h1 className="text-2xl font-semibold text-neutral-700">
              Just one more step!
            </h1>
            <img
              src="./logo-with-mail.png"
              className="h-48 mx-auto mt-10 mb-5"
            />
            {/* <p className="text-sm font-semibold text-neutral-500">
              Your room is almost ready!
            </p> */}
            <p className="text-xs text-neutral-500">
              To finish canceling, please open the email we just sent and click
              Confirm Cancellation.
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-6 border-2 border-primary-1 rounded-full py-2 w-full text-neutral-800"
            >
              Back to home
            </button>
          </div>
        </div>
      ) : null}
      <section className="mx-auto w-11/12 mt-5">
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="flex gap-2">
            <input
              name="search"
              className="px-3 py-1 border rounded-full bg-white border-neutral-400
                    w-full shadow-xl placeholder-neutral-400
                    focus:outline-none focus:ring-2 focus:ring-primary-2 focus:border-transparent
                    transition duration-200"
              placeholder="Search by email"
            />
            <button
              type="submit"
              className="bg-white rounded-full shadow-lg border border-neutral-400"
            >
              <SearchRounded className="text-neutral-400 m-2" />
            </button>
          </div>
        </form>

        <div className="my-5">
          <p className="font-meduim text-neutral-500 text-sm mb-2">
            Your reservation list.
          </p>
          <div>
            {searchResult
              ? searchResult?.map((data: any, index: number) => (
                  <div key={index}>
                    {isCancle ? (
                      <div className="fixed left-0 top-0 w-full h-full bg-black/10 z-50 backdrop-blur-xs">
                        <div className="text-center absolute left-1/2 top-1/2 transform -translate-1/2 p-4 w-72 bg-white rounded-3xl">
                          <h1 className="text-2xl font-semibold text-neutral-700">
                            Cancel this reservation?
                          </h1>
                          <img
                            src="./conflics-icon.png"
                            className="h-48 mx-auto mt-10 mb-5"
                          />
                          <div className="mt-6">
                            <button
                              onClick={async () => {
                                setLoading(true);
                                await fetch(`/api/room_schedule/request`, {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    id: data.id,
                                  }),
                                }).then(() => {
                                  setLoading(false);
                                  setIsCancle(false);
                                  setIsSendmail(true);
                                });
                              }}
                              className="rounded-full py-2 w-full text-white bg-red-700/80"
                            >
                              Yes, Cancel
                            </button>
                            <button
                              onClick={() => setIsCancle(false)}
                              className="mt-2 rounded-full py-2 w-full text-neutral-800 bg-neutral-300"
                            >
                              Nevermind
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : null}
                    <div className="rounded-t-3xl bg-linear-to-r from-primary-1 to-primary-3 flex justify-between pt-3 pb-6 px-4">
                      <p className="text-white font-medium">
                        {dayjs(data.date).date()}{" "}
                        {MONTH_NAMES[dayjs(data.date).month()]}{" "}
                        {dayjs(data.date).year()}
                      </p>
                      <p className="text-white">
                        {dayjs(data.startTime).format("HH:MM")} -{" "}
                        {dayjs(data.endTime).format("HH:MM")}
                      </p>
                    </div>
                    <div className="rounded-3xl p-4 bg-white transform -translate-y-4">
                      <div className="flex justify-between">
                        <div>
                          {" "}
                          <p className="text-neutral-500">{data.company}</p>
                          <p className="text-2xl">Room : {data.room.name}</p>
                        </div>
                        <div className="w-fit mt-auto">
                          <button
                            type="button"
                            className="bg-red-600/80 text-white px-3 py-1 rounded-full"
                            onClick={() => setIsCancle(true)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>

                      <hr className="my-3 border-neutral-300" />
                      <p>{data.name}</p>
                      <p>{data.tel}</p>
                      <p>{data.email}</p>
                      <p>{data.details}</p>
                    </div>
                  </div>
                ))
              : ""}
          </div>
        </div>
      </section>
    </div>
  );
};
export default Search;
