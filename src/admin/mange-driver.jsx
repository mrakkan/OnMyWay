import React from "react";
import AdminSidebar from "./sidebar";
import { useNavigate } from "react-router-dom";

export default function ManageDriver() {
  const navigate = useNavigate();
  const [approvedDrivers, setApprovedDrivers] = React.useState([]);
  const [deletedDrivers, setDeletedDrivers] = React.useState([]);
  const [searchText, setSearchText] = React.useState("");
  const [showDeleted, setShowDeleted] = React.useState(false);

  const loadApprovedDrivers = React.useCallback(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const approved = users
      .filter((user) => user.driverApprovalStatus === "approved")
      .map((user, index) => ({
        ...user,
        rating: user.rating || (4.5 + ((index % 6) * 0.1)).toFixed(1),
        rides: user.rides || 20 + index * 7,
        income: user.income || 8000 + index * 1200,
      }));

    setApprovedDrivers(approved);
  }, []);

  const loadDeletedDrivers = React.useCallback(() => {
    const deleted = JSON.parse(localStorage.getItem("deletedDrivers")) || [];
    setDeletedDrivers(deleted);
  }, []);

  React.useEffect(() => {
    loadApprovedDrivers();
    loadDeletedDrivers();
  }, [loadApprovedDrivers, loadDeletedDrivers]);

  const handleDelete = (email) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const deleted = JSON.parse(localStorage.getItem("deletedDrivers")) || [];
    const targetDriver = users.find((user) => user.email === email);

    if (targetDriver) {
      const nextDeleted = [
        ...deleted.filter((driver) => driver.email !== email),
        {
          ...targetDriver,
          deletedAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem("deletedDrivers", JSON.stringify(nextDeleted));
    }

    const nextUsers = users.filter((user) => user.email !== email);
    localStorage.setItem("users", JSON.stringify(nextUsers));

    loadApprovedDrivers();
    loadDeletedDrivers();
  };

  const handleRestore = (email) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const deleted = JSON.parse(localStorage.getItem("deletedDrivers")) || [];

    const restoreTarget = deleted.find((driver) => driver.email === email);
    if (!restoreTarget) return;

    const nextUsers = [
      ...users.filter((user) => user.email !== email),
      {
        ...restoreTarget,
        driverApprovalStatus: "approved",
      },
    ];

    const nextDeleted = deleted.filter((driver) => driver.email !== email);

    localStorage.setItem("users", JSON.stringify(nextUsers));
    localStorage.setItem("deletedDrivers", JSON.stringify(nextDeleted));

    loadApprovedDrivers();
    loadDeletedDrivers();
  };

  const activeList = showDeleted ? deletedDrivers : approvedDrivers;

  const filteredDrivers = activeList.filter((driver) => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) return true;
    return (driver.fullName || "").toLowerCase().includes(keyword);
  });

    return (
        <div className="min-h-screen bg-[#FDF8FD] text-on-surface font-[Lexend] flex">
                  
                  <AdminSidebar />
            
                  <div className="flex-1 flex flex-col h-screen overflow-y-auto">
            
                    
            
              {/* Main */}
              <main className="flex-1 px-6 md:px-10 mt-2 md:mt-0 pt-10">
                
                {/* Header */}
                <h2 className="text-3xl font-extrabold mb-2 flex">
                    Manage Drivers
                  </h2>
                  <div className="flex gap-4">
          <input
            placeholder="Search by name..."
            className="flex-1 px-4 py-3 rounded-xl bg-white"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button
            className="px-6 py-3 bg-white rounded-xl"
            type="button"
            onClick={() => {
              setShowDeleted((prev) => !prev);
            }}
          >
            {showDeleted
              ? `View Approved (${approvedDrivers.length})`
              : `View Deleted (${deletedDrivers.length})`}
          </button>
          
        </div>
                  

                  <table className="w-full mt-6 bg-white rounded-xl overflow-hidden">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b">
              <th className="p-4">Driver</th>
              <th className="p-4">Approval Status</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Ride</th>
              <th className="p-4">Income</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-gray-500">
                  {showDeleted ? "No deleted drivers found." : "No approved drivers found."}
                </td>
              </tr>
            ) : (
              filteredDrivers.map((driver) => (
                <tr key={driver.email} className="border-b last:border-0">
                  <td className="p-4">
                    <p className="font-semibold">{driver.fullName || "-"}</p>
                    <p className="text-sm text-gray-500">{driver.email || "-"}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${showDeleted ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                      {showDeleted ? "deleted" : (driver.driverApprovalStatus || "pending")}
                    </span>
                  </td>
                  <td className="p-4">{driver.rating}</td>
                  <td className="p-4">{driver.rides}</td>
                  <td className="p-4">฿ {Number(driver.income || 0).toLocaleString()}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/admin/profile?email=${encodeURIComponent(driver.email)}`)
                        }
                        className="px-3 py-1 rounded border border-purple-300 text-purple-700 hover:bg-purple-50"
                      >
                        See Profile
                      </button>
                      {!showDeleted && (
                        <button
                          type="button"
                          onClick={() => handleDelete(driver.email)}
                          className="px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      )}
                      {showDeleted && (
                        <button
                          type="button"
                          onClick={() => handleRestore(driver.email)}
                          className="px-3 py-1 rounded border border-green-300 text-green-700 hover:bg-green-50"
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
                </main>
            </div>
            </div>
    );

}