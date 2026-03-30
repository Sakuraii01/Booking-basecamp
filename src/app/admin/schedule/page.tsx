"use client";
import { Navbar } from "../../component/navbar";
import { useState } from "react";
import useViewModel from "./viewModel";

const ITEMS_PER_PAGE = 10;

const AdminSchedulePage = () => {
  const { roomSchedules, formatTime, handleCancel } = useViewModel();
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil((roomSchedules?.length || 0) / ITEMS_PER_PAGE);

  const paginatedSchedules = roomSchedules?.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="m-4 flex gap-4">
      <Navbar />

      <section className="flex-1 p-6 bg-white rounded-2xl shadow-md">
        <div>
          <h2 className="font-semibold text-lg mb-3">Room Schedules</h2>

          <div className="overflow-x-auto">
            <table className="w-full border rounded-xl overflow-hidden">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Room</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSchedules?.map((s: any) => (
                  <tr key={s.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{s.room.name}</td>
                    <td className="p-3">
                      {new Date(s.date).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {formatTime(s.startTime)} – {formatTime(s.endTime)}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm
                          ${
                            s.status === "CONFIRMED"
                              ? "bg-green-100 text-green-700"
                              : s.status === "CANCELLED"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {s.status === "CONFIRMED" && (
                        <button
                          onClick={() => handleCancel(s.id)}
                          className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 border rounded-lg disabled:opacity-40"
            >
              Previous
            </button>

            <span>
              Page {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 border rounded-lg disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminSchedulePage;
