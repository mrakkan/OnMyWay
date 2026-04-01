import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "./sidebar";
import mockUsers from "./mock-user.json";
import mockUserRequests from "./mock-userrequest.json";

const getAllUsers = () => {
  const users = JSON.parse(localStorage.getItem("mockUsers")) || [];
  return users.length > 0 ? users : mockUsers;
};

export default function UserDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const user = React.useMemo(() => {
    const users = getAllUsers();
    return users.find((item) => item.userId === id || item.emailAddress === id) || null;
  }, [id]);

  const userRequests = React.useMemo(() => {
    if (!user?.userId) return [];

    return mockUserRequests
      .filter((request) => request.userId === user.userId)
      .sort((a, b) => `${b.day} ${b.time}`.localeCompare(`${a.day} ${a.time}`));
  }, [user]);

  const requestSummary = React.useMemo(() => {
    return userRequests.reduce(
      (acc, request) => {
        acc.total += 1;
        if (request.status === "done") acc.done += 1;
        if (request.status === "pending") acc.pending += 1;
        if (request.status === "cancelled") acc.cancelled += 1;
        return acc;
      },
      { total: 0, done: 0, pending: 0, cancelled: 0 }
    );
  }, [userRequests]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDF8FD] text-on-surface font-[Lexend] flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col h-screen overflow-y-auto px-6 md:px-10 pt-10">
          <div className="bg-white rounded-2xl p-6 shadow border border-red-100">
            <h2 className="text-2xl font-bold text-[#4C3A78]">User not found</h2>
            <p className="text-gray-500 mt-2">The requested user detail could not be loaded.</p>
            <button
              type="button"
              onClick={() => navigate("/admin/manage-user")}
              className="mt-4 px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700"
            >
              Back to Manage Users
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8FD] text-on-surface font-[Lexend] flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <main className="flex-1 px-6 md:px-10 pt-10 pb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-extrabold text-[#4C3A78]">User Detail</h2>
              <p className="text-gray-500 mt-1">Detailed profile for selected user</p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/admin/manage-user")}
              className="px-4 py-2 rounded-lg border border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold"
            >
              Back
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-white rounded-2xl p-6 shadow">
              <h3 className="text-xl font-bold text-[#4C3A78] mb-4">Basic Info</h3>
              <div className="space-y-3 text-sm">
                <p><span className="font-semibold mr-2">User ID:</span>{user.userId || "-"}</p>
                <p><span className="font-semibold mr-2">Full Name:</span>{user.fullName || "-"}</p>
                <p><span className="font-semibold mr-2">Date of Birth:</span>{user.dateOfBirth || "-"}</p>
                <p><span className="font-semibold mr-2">Phone Number:</span>{user.phoneNumber || "-"}</p>
                <p><span className="font-semibold mr-2">Email:</span>{user.emailAddress || "-"}</p>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow">
              <h3 className="text-xl font-bold text-[#4C3A78] mb-4">Address</h3>
              <div className="space-y-3 text-sm">
                <p><span className="font-semibold mr-2">Street Address:</span>{user.streetAddress || "-"}</p>
                <p><span className="font-semibold mr-2">Apartment:</span>{user.apartment || "-"}</p>
                <p><span className="font-semibold mr-2">City:</span>{user.city || "-"}</p>
                <p><span className="font-semibold mr-2">State:</span>{user.state || "-"}</p>
                <p><span className="font-semibold mr-2">Postal Code:</span>{user.postalCode || "-"}</p>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow lg:col-span-2">
              <h3 className="text-xl font-bold text-[#4C3A78] mb-4">Activity Summary</h3>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                <div className="rounded-xl bg-purple-50 p-4">
                  <p className="text-xs text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-[#4C3A78]">{requestSummary.total}</p>
                </div>
                <div className="rounded-xl bg-green-50 p-4">
                  <p className="text-xs text-gray-600">Done</p>
                  <p className="text-2xl font-bold text-green-700">{requestSummary.done}</p>
                </div>
                <div className="rounded-xl bg-amber-50 p-4">
                  <p className="text-xs text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-amber-700">{requestSummary.pending}</p>
                </div>
                <div className="rounded-xl bg-red-50 p-4">
                  <p className="text-xs text-gray-600">Cancelled</p>
                  <p className="text-2xl font-bold text-red-700">{requestSummary.cancelled}</p>
                </div>
              </div>

              {userRequests.length === 0 ? (
                <p className="text-sm text-gray-500">No requests found for this user.</p>
              ) : (
                <div className="space-y-3">
                  {userRequests.map((request) => (
                    <div
                      key={request.requestId}
                      className="rounded-xl border border-gray-100 p-4 bg-[#FAF9FF]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-[#4C3A78]">{request.requestId}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            request.status === "done"
                              ? "bg-green-100 text-green-700"
                              : request.status === "pending"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        <span className="font-semibold mr-1">Route:</span>
                        {request.pickup} to {request.destination}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        <span className="font-semibold mr-1">Date/Time:</span>
                        {request.day} {request.time}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        <span className="font-semibold mr-1">Driver:</span>
                        {request.driver?.name || "-"} ({request.driver?.rating ?? "-"})
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
