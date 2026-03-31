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
