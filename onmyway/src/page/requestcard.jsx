import React from "react";


export default function RequestCard({
  name,
  day,
  time,
  pickup,
  destination,
  note,
  duration,
  income,
  onAccept,
  onDecline,
  onClick,
  mode = "request",
  status
}) {
  return (
    <div
  className={`bg-white rounded-xl p-6 shadow flex flex-col gap-4 
    ${mode === "work" ? "cursor-pointer hover:shadow-lg transition" : ""}
  `}
  onClick={mode === "work" ? onClick : undefined}
>
      
      <div className="flex justify-between">
        <div className="flex flex-col ">
          <h3 className="text-xl font-bold">{name}</h3>
        </div>
        <p className="font-bold text-purple-600">{day}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 flex items-center font-semibold">
            <span className="material-symbols-outlined text-xl rounded-full bg-purple-200 text-purple-600 p-1 mr-2 w-7 h-7 flex items-center justify-center ">
              home
            </span>
            Pickup
          </p>
          <p className="flex mt-1 text-sm pl-9 text-gray-700">{pickup}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 flex items-center font-semibold">
            <span className="material-symbols-outlined text-xl rounded-full bg-red-200 text-red-600 p-1 mr-2 w-7 h-7 flex items-center justify-center ">
              location_on
            </span>
            Destination
          </p>
          <p className="flex mt-1 text-sm pl-9 text-gray-700">{destination}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 flex items-center font-semibold">
            <span className="material-symbols-outlined text-xl rounded-full bg-pink-200 text-pink-600 p-1 mr-2 w-7 h-7 flex items-center justify-center ">
              schedule
            </span>
            Pickup Time
          </p>
          <p className="flex mt-1 text-sm pl-9 text-gray-700">{time}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 flex items-center font-semibold mt-2">
            <span className="material-symbols-outlined text-xl rounded-full bg-blue-200 text-blue-600 p-1 mr-2 w-7 h-7 flex items-center justify-center ">
              timer
            </span>
            Estimated Duration
          </p>
          <p className="flex mt-1 text-sm pl-9 text-gray-700">{duration}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
        <p className="text-sm text-gray-500 flex items-center font-semibold">
          <span className="material-symbols-outlined text-xl rounded-full bg-yellow-200 text-yellow-600 p-1 mr-2 w-7 h-7 flex items-center justify-center ">
            monetization_on
          </span>
          Total Income
        </p>
        <p className="flex mt-1 text-sm pl-9 text-gray-700">{income}</p>
      </div>

    {mode === "work" && (
  <div>
    <p className="text-sm text-gray-500 flex items-center font-semibold">
      <span className="material-symbols-outlined text-xl rounded-full bg-green-200 text-green-600 p-1 mr-2 w-7 h-7 flex items-center justify-center ">
        task_alt
      </span>
      Status
    </p>
    <p className="flex mt-1 text-sm pl-9 text-gray-700">
      {status || "Accepted"}
    </p>
  </div>
)}
      </div>
      <div className="bg-gray-100 p-3 rounded flex flex-col gap-2 text-sm">
        <p className="font-semibold flex items-center text-gray-700">
          <span className="material-symbols-outlined text-xl w-7 h-7 flex items-center justify-center ">
            notes
          </span>
          User Note
        </p>
        <p className="text-sm flex">{note}</p>
      </div>

      {/* 👇 ซ่อนปุ่มใน MyWork */}
      {mode === "request" && (
  <div className="flex gap-2">
    <button onClick={onAccept} className="flex-1 bg-purple-600 text-white py-2 rounded">
      Accept
    </button>
    <button onClick={onDecline} className="flex-1 border py-2 rounded">
      Decline
    </button>
  </div>

  
)}

      
    </div>
  );
}