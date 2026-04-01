import React from "react";
import DriverSidebar from "./sidebar";
import RequestCard from "./requestcard";
import DriverTopHeader from "./top-header";
import LightWavesBackground from "../components/LightWavesBackground";

const SHARED_WAVES_COLORS = ["#7c3aed", "#8b5cf6", "#a78bfa", "#6d28d9", "#9333ea"];

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
              <h2 className="text-3xl font-extrabold mb-2 flex text-[#24143f]">My Requests</h2>
              <p className="text-gray-600 mb-7 flex">
                {isDriverApproved
                  ? `You have ${requests.length} new ride requests`
                  : "Your account is under review"}
              </p>

              {isDriverApproved ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
                <div className="sun-card sun-card--review p-6 sm:p-8 text-gray-700">
                  <p className="text-lg font-semibold">{approvalMessage}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    ระบบจะเปิดรับงานให้เมื่อสถานะผ่านการอนุมัติแล้ว
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
