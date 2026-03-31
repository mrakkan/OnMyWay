import React from "react";
import DriverSidebar from "./sidebar";
import RequestCard from "./requestcard";
import DriverTopHeader from "./top-header";

const getCurrentDriverApprovalStatus = () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const matchedUser =
    users.find(
      (user) =>
        user.email?.toLowerCase() === currentUser?.email?.toLowerCase()
    ) || currentUser;

  return matchedUser?.driverApprovalStatus || "pending";
};

export default function DriverRequests({ requests, onAccept ,onDecline}) {
  const [approvalStatus, setApprovalStatus] = React.useState(() =>
    getCurrentDriverApprovalStatus()
  );

  React.useEffect(() => {
    const syncApprovalStatus = () => {
      setApprovalStatus(getCurrentDriverApprovalStatus());
    };

    syncApprovalStatus();
    window.addEventListener("storage", syncApprovalStatus);

    return () => {
      window.removeEventListener("storage", syncApprovalStatus);
    };
  }, []);

  const isDriverApproved = approvalStatus === "approved";
  const approvalMessage =
    approvalStatus === "rejected"
      ? "ไม่ผ่านเงื่อนไขการทำงาน"
      : "รอการ verify ก่อน";

  return (
    <div className="min-h-screen bg-[#FDF8FD] text-on-surface font-[Lexend] flex">
      
      <DriverSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">

        <DriverTopHeader />

        <main className="flex-1 px-6 md:px-10 mt-2 md:mt-0">
          
          <h2 className="text-3xl font-extrabold mb-2 flex">
            My Requests
          </h2>
          <p className="text-gray-500 mb-10 flex">
            {isDriverApproved
              ? `You have ${requests.length} new ride requests`
              : "Your account is under review"}
          </p>

          {isDriverApproved ? (
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
          ) : (
            <div className="bg-white rounded-xl p-6 shadow text-gray-700">
              <p className="text-lg font-semibold">{approvalMessage}</p>
              <p className="text-sm text-gray-500 mt-2">
                ระบบจะเปิดรับงานให้เมื่อสถานะผ่านการอนุมัติแล้ว
              </p>
            </div>
          )}

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