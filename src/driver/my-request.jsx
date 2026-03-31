import React from "react";
import DriverSidebar from "./sidebar";
import RequestCard from "./requestcard";

export default function DriverRequests({ requests, onAccept ,onDecline}) {
  return (
    <div className="min-h-screen bg-[#FDF8FD] text-on-surface font-[Lexend] flex">
      
      <DriverSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">

        <header className="pt-5 px-8 flex items-center justify-end ">
          <div className="flex items-center gap-3">
            <p className="p-2 bg-green-200 text-green-800 rounded-xl text-sm font-semibold flex items-center gap-1">
                                <span className="material-symbols-outlined  ">
                                        verified
                                </span>
                                verify
                            </p>
            <div className="flex items-center gap-3">
              <p className="font-bold text-[#581C87]">David Miller</p>
              <img
                className="w-10 h-10 rounded-full object-cover"
                src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 md:px-10 mt-2 md:mt-0">
          
          <h2 className="text-3xl font-extrabold mb-2 flex">
            My Requests
          </h2>
          <p className="text-gray-500 mb-10 flex">
            You have {requests.length} new ride requests
          </p>

          {/* CARD LIST */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 ">
            {requests.map((req) => (
              <RequestCard
                key={req.id}
                {...req}
                mode="request"
                onAccept={() => onAccept(req)}
                onDecline={() => onDecline(req)}
              />
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
/* ================== CARD ================== */
// function RequestCard({
//   name,
// //   rating,
// //   rides,
// day,
//   time,
//   pickup,
//   destination,
//   note,
//   duration,
//   income,
//   onAccept,
//   onDecline
// }) {
//   return (
//     <div className="bg-white rounded-xl p-6 shadow flex flex-col gap-4">
      
//       {/* TOP */}
//       <div className="flex justify-between">
//         <div className="flex flex-col ">
//           <h3 className="text-xl font-bold">{name}</h3>
          
//         </div>
//         <p className="font-bold text-purple-600">{day}</p>
//       </div>

//       {/* LOCATION */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//             <p className="text-sm text-gray-500 flex items-center font-semibold">
//             <span className="material-symbols-outlined text-xl rounded-full bg-purple-200 text-purple-600 p-1 mr-2 w-7 h-7 flex items-center justify-center ">
//                 home
//                                 </span>
//             Pickup</p>
//         <p className="flex mt-1 text-sm pl-9 text-gray-700">{pickup}</p>
//         </div>
        

//         <div>
//             <p className="text-sm text-gray-500 flex items-center font-semibold">
//                 <span className="material-symbols-outlined text-xl rounded-full bg-red-200 text-red-600 p-1 mr-2 w-7 h-7 flex items-center justify-center ">
//                 location_on
//                                 </span>
//                 Destination</p>
//         <p className="flex mt-1 text-sm pl-9 text-gray-700">{destination}</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div >
//           <p className="text-sm text-gray-500 flex items-center font-semibold">
//             <span className="material-symbols-outlined text-xl rounded-full bg-pink-200 text-pink-600 p-1 mr-2 w-7 h-7 flex items-center justify-center ">
//             schedule
//                                 </span>
//             Pickup Time</p>
//         <p className="flex mt-1 text-sm pl-9 text-gray-700">{time}</p>
//         </div>
//         <div>
//           <p className="text-sm text-gray-500 flex items-center font-semibold mt-2">
//             <span className="material-symbols-outlined text-xl rounded-full bg-green-200 text-green-600 p-1 mr-2 w-7 h-7 flex items-center justify-center ">
//             timer
//                                 </span>
//             Estimated Duration</p>
//         <p className="flex mt-1 text-sm pl-9 text-gray-700">{duration}</p>
//         </div>

//       </div>
// <div>
//             <p className="text-sm text-gray-500 flex items-center font-semibold">
//                 <span className="material-symbols-outlined text-xl rounded-full bg-yellow-200 text-yellow-600 p-1 mr-2 w-7 h-7 flex items-center justify-center ">
//                 monetization_on
//                                 </span>
//                 Total Income</p>
//         <p className="flex mt-1 text-sm pl-9 text-gray-700">{income}</p>
//         </div>
//       {/* NOTE */}
//       <div className="bg-gray-100 p-3 rounded flex flex-col gap-2 text-sm">
//         <p className="font-semibold flex items-center text-gray-700">
//           <span className="material-symbols-outlined text-xl   p-1  w-7 h-7 flex items-center justify-center ">
//             notes
//                                 </span>
//           User Note</p>
//         <p className="text-sm flex">{note}</p>
//       </div>
      

//       {/* BUTTON */}
//       <div className="flex gap-2">
//         <button className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
//         onClick={onAccept}>
//           Accept
//         </button>
//         <button className="flex-1 border py-2 rounded hover:bg-gray-100 transition"
//         onClick={onDecline}>
//           Decline
//         </button>
//       </div>

//     </div>
//   );
// }