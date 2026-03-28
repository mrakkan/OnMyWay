import React from "react";

export default function Dashboard() {
  return (
    <div className="flex bg-surface text-on-surface font-body">
      
      {/* Sidebar */}
      <aside className="h-screen w-72 fixed left-0 top-0 flex flex-col bg-[#f2ecf5] z-40">
        <div className="flex flex-col h-full py-8 space-y-2">
          
          {/* Brand */}
          <div className="px-8 mb-10">
            <span className="text-xl font-black text-[#684cb5]">
              ElderCare Ride
            </span>
          </div>

          {/* Profile */}
          <div className="px-8 mb-8">
            <div className="flex items-center gap-4">
              <img
                className="w-12 h-12 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjmWwjeDbvePvaks2XTSaW8jJ6GRmWq-7h0MkVdyl-2ALSIO0S4mw7QHyGPMRGGtbfJUX3bfExliNXRzyNcZxdAGg7sYBQeHqXcx_fLhKU9p49n5i8I0hn8Dw7rOsL398B8BlaObJ4Vp3Zlz5IlrVwTnEhs-d3Gbn_-2sFYJtL9SAnmjaDbLoqO9ObKpNApY6VGCemr-Ljw0U_yNdCg_srvcPB9-xxqrDxaX9Ac_r2jQmCUNuACfVftw-yw8JOp6hkFVKmgBiRHBJ2"
                alt=""
              />
              <div>
                <p className="font-bold text-sm">Welcome back</p>
                <p className="text-xs text-gray-500">
                  Concierge Service Active
                </p>
              </div>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1">
            <MenuItem title="Dashboard" active />
            <MenuItem title="Active Rides" />
            <MenuItem title="Driver Network" />
            <MenuItem title="Payment" />
            <MenuItem title="Settings" />
          </nav>

          {/* Button */}
          <div className="px-6 py-4">
            <button className="w-full py-3 bg-primary text-white rounded-xl font-bold">
              Request New Ride
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-72 p-10 w-full">
        
        {/* Header */}
        <div className="mb-10 flex justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Performance Overview
            </h1>
            <p className="text-gray-500">
              Here is your impact this month
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Card title="Jobs Completed" value="148" />
          <Card title="Monthly Income" value="$1,240" />
          <Card title="Impact Score" value="4.9/5" highlight />
        </div>

        {/* Requests */}
        <div className="bg-gray-100 p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">
            Incoming Requests
          </h2>

          <div className="space-y-4">
            <RequestCard name="Martha Jenkins" time="10:30 AM" />
            <RequestCard name="Robert Chen" time="01:15 PM" />
            <RequestCard name="George Miller" time="04:45 PM" />
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function MenuItem({ title, active }) {
  return (
    <div
      className={`px-6 py-3 cursor-pointer ${
        active ? "bg-purple-200 text-purple-700" : "text-gray-600"
      }`}
    >
      {title}
    </div>
  );
}

function Card({ title, value, highlight }) {
  return (
    <div
      className={`p-6 rounded-xl ${
        highlight ? "bg-purple-600 text-white" : "bg-white"
      }`}
    >
      <p className="text-sm">{title}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
  );
}

function RequestCard({ name, time }) {
  return (
    <div className="bg-white p-4 rounded-xl flex justify-between items-center">
      <div>
        <p className="font-bold">{name}</p>
        <p className="text-sm text-gray-500">{time}</p>
      </div>

      <div className="flex gap-2">
        <button className="px-4 py-2 bg-green-200 text-green-700 rounded-lg">
          Accept
        </button>
        <button className="px-4 py-2 bg-red-200 text-red-700 rounded-lg">
          Reject
        </button>
      </div>
    </div>
  );
}