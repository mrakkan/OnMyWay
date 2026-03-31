import React from "react";
import RequestCard from "./requestcard";
import DriverSidebar from "./sidebar";
import DriverTopHeader from "./top-header";
import { useNavigate } from "react-router-dom";
export default function MyWorkPage({ myWork }) {
  const navigate = useNavigate();

  const parseWorkDateTime = (day, time) => {
    if (!day) return Number.MAX_SAFE_INTEGER;

    const [datePart] = String(day).split(" ");
    const [dayValue, monthValue, yearValue] = datePart.split("/").map(Number);

    if (!dayValue || !monthValue || !yearValue) {
      return Number.MAX_SAFE_INTEGER;
    }

    let hours = 0;
    let minutes = 0;

    if (time) {
      const [timePart, meridiemRaw] = String(time).trim().split(" ");
      const [h = "0", m = "0"] = (timePart || "").split(":");
      hours = Number(h);
      minutes = Number(m);

      const meridiem = (meridiemRaw || "").toUpperCase();
      if (meridiem === "PM" && hours < 12) hours += 12;
      if (meridiem === "AM" && hours === 12) hours = 0;
    }

    return new Date(yearValue, monthValue - 1, dayValue, hours, minutes, 0, 0).getTime();
  };

  const sortedMyWork = [...myWork].sort((a, b) => {
    return parseWorkDateTime(a.day, a.time) - parseWorkDateTime(b.day, b.time);
  });

  return (
    <div className="min-h-screen bg-[#FDF8FD] text-on-surface font-[Lexend] flex">
      <DriverSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <DriverTopHeader />

        <main className="flex-1 px-6 md:px-10 mt-2 md:mt-0">
          <h2 className="text-3xl font-extrabold mb-2 flex">My Works</h2>
          <p className="text-gray-500 mb-10 flex">
            You have {sortedMyWork.length} works in progress
          </p>

          {sortedMyWork.length === 0 ? (
            <div className="bg-white rounded-xl p-6 shadow text-gray-600">
              No works yet. Go to My Request and press Accept to add work.
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8" href="">
              {sortedMyWork.map((job) => (
                <RequestCard key={job.id} {...job} 
                mode="work" 
                status={job.status}
  onClick={() => navigate(`/work/${job.id}`)}/>
              ))}

              
            </div>
          )}
        </main>
      </div>
    </div>
  );
}