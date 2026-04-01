import React from "react";
import RequestCard from "./requestcard";
import DriverSidebar from "./sidebar";
import DriverTopHeader from "./top-header";
import { useNavigate } from "react-router-dom";
import LightWavesBackground from "../components/LightWavesBackground";

const SHARED_WAVES_COLORS = ["#7c3aed", "#8b5cf6", "#a78bfa", "#6d28d9", "#9333ea"];

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

  const activeWorks = sortedMyWork.filter((job) => job.status !== "Completed");
  const completedWorks = sortedMyWork.filter((job) => job.status === "Completed");

  return (
    <div className="relative min-h-screen text-on-surface font-[Lexend]">
      <LightWavesBackground
        className="pointer-events-none z-0"
        colors={SHARED_WAVES_COLORS}
        speed={0.82}
        intensity={0.52}
      />

      <div className="relative z-10 flex min-h-screen">
        <DriverSidebar />

        <div className="flex-1 flex flex-col h-screen overflow-y-auto">
          <DriverTopHeader />

          <main className="flex-1 pt-3 pb-10 lg:pb-14">
            <div className="mx-auto w-full max-w-[1240px] px-5 lg:px-8">
              <h2 className="text-3xl font-extrabold mb-2 flex text-[#24143f]">My Works</h2>
              <p className="text-gray-600 mb-7 flex">
                You have {activeWorks.length} works in progress
              </p>

              {activeWorks.length === 0 ? (
                <div className="sun-card sun-card--review p-6 sm:p-8 text-gray-600">
                  No active works right now. Go to My Request and press Accept to add work.
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {activeWorks.map((job) => (
                    <RequestCard
                      key={job.id}
                      {...job}
                      mode="work"
                      status={job.status}
                      onClick={() => navigate(`/driver/work/${job.id}`)}
                    />
                  ))}
                </div>
              )}

              {completedWorks.length > 0 && (
                <>
                  <h3 className="mt-10 text-2xl font-extrabold text-[#24143f]">Completed Works</h3>
                  <p className="text-gray-600 mb-5">You have completed {completedWorks.length} works</p>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {completedWorks.map((job) => (
                      <RequestCard
                        key={job.id}
                        {...job}
                        mode="work"
                        status={job.status}
                        onClick={() => navigate(`/driver/work/${job.id}`)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}