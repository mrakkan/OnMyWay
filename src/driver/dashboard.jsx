import React from "react";
import { Link } from "react-router-dom";
import LightWavesBackground from "../components/LightWavesBackground";
import DriverSidebar from "./sidebar";
import DriverTopHeader from "./top-header";

const SHARED_WAVES_COLORS = ["#7c3aed", "#8b5cf6", "#a78bfa", "#6d28d9", "#9333ea"];

export default function Dashboard() {
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
              <h2 className="text-3xl font-extrabold mb-2 flex text-[#24143f]">
                Performance Overview
              </h2>
              <p className="text-gray-600 mb-7 flex">Here is your impact this month</p>

              <div className="mb-8 grid gap-3 sm:grid-cols-3">
                <Link
                  to="/driver/my-request"
                  className="rounded-2xl border border-violet-200 bg-white/80 px-4 py-3 font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50"
                >
                  Go to My Request
                </Link>
                <Link
                  to="/driver/my-works"
                  className="rounded-2xl border border-violet-200 bg-white/80 px-4 py-3 font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50"
                >
                  Go to My Works
                </Link>
                <Link
                  to="/driver/help-center"
                  className="rounded-2xl border border-violet-200 bg-white/80 px-4 py-3 font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50"
                >
                  Open Help Center
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="bg-purple-100/90 p-6 rounded-xl shadow">
                  <p className="text-md text-gray-600 flex">
                    <span className="material-symbols-outlined mr-2">directions_car</span>
                    Total Rides
                  </p>
                  <h2 className="text-3xl font-bold text-purple-800">128</h2>
                </div>
                <div className="bg-[#E7E0EB]/90 p-6 rounded-xl shadow">
                  <p className="text-md text-gray-600 flex">
                    <span className="material-symbols-outlined mr-2">monetization_on</span>
                    Total Earnings
                  </p>
                  <h2 className="text-3xl font-bold text-purple-800">$1,024</h2>
                </div>
                <div className="bg-[#684CB5] p-6 rounded-xl shadow">
                  <p className="text-md text-white flex">
                    <span className="material-symbols-outlined mr-2">star</span>
                    Rating Score
                  </p>
                  <h2 className="text-3xl font-bold text-white">4.9/5</h2>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur rounded-xl p-6 mb-10 border border-violet-100 shadow-sm">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <span className="material-symbols-outlined mr-2">history</span>
                  Incoming History
                </h2>

                <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2">
                  <RequestCard name="Martha Jenkins" time="10:30 AM" incoming="30" date="2023-10-01" rate={5} />
                  <RequestCard name="Robert Chen" time="01:15 PM" incoming="25" date="2023-10-01" rate={4} />
                  <RequestCard name="George Miller" time="04:45 PM" incoming="40" date="2023-10-01" rate={5} />
                  <RequestCard name="George Miller" time="04:45 PM" incoming="40" date="2023-10-01" rate={5} />
                  <RequestCard name="George Miller" time="04:45 PM" incoming="40" date="2023-10-01" rate={5} />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}





function RequestCard({ name, time, incoming, date, rate }) {
  return (
    <div className="bg-white p-4 rounded-xl flex justify-between items-center">
      <div>
        <p className="font-bold flex">{name} 
        <span className="material-symbols-outlined text-yellow-400 ml-2">
            star
        </span>
        <span className="font-bold text-yellow-400 ml-1">{rate}</span>
        </p>
        <p className="text-sm text-gray-500 flex">{date} • {time}</p>
      </div>

      <div className="flex gap-2">
        <div>
            <span className="material-symbols-outlined text-green-600">
          monetization_on
        </span>
        </div>
        <p className="font-bold">${incoming}</p>
      </div>
    </div>
    
  );
}