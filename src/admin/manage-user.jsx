import React from "react";
import AdminSidebar from "./sidebar";
import mockUsers from "./mock-user.json";

const ensureUserIds = (list = []) =>
  list.map((user, index) => {
    if (user.userId) return user;
    return {
      ...user,
      userId: `USR${String(index + 1).padStart(3, "0")}`,
    };
  });

export default function ManageUser() {
  const [users, setUsers] = React.useState([]);
  const [deletedUsers, setDeletedUsers] = React.useState([]);
  const [searchText, setSearchText] = React.useState("");
  const [showDeleted, setShowDeleted] = React.useState(false);

  const loadUsers = React.useCallback(() => {
    const storedUsers = JSON.parse(localStorage.getItem("mockUsers")) || [];
    const seededUsers = storedUsers.length > 0 ? storedUsers : mockUsers;
    const normalizedUsers = ensureUserIds(seededUsers);

    if (storedUsers.length === 0) {
      localStorage.setItem("mockUsers", JSON.stringify(normalizedUsers));
    } else if (JSON.stringify(storedUsers) !== JSON.stringify(normalizedUsers)) {
      localStorage.setItem("mockUsers", JSON.stringify(normalizedUsers));
    }

    setUsers(normalizedUsers);
  }, []);

  const loadDeletedUsers = React.useCallback(() => {
    const deleted = JSON.parse(localStorage.getItem("deletedMockUsers")) || [];
    const normalizedDeletedUsers = ensureUserIds(deleted);

    if (JSON.stringify(deleted) !== JSON.stringify(normalizedDeletedUsers)) {
      localStorage.setItem("deletedMockUsers", JSON.stringify(normalizedDeletedUsers));
    }

    setDeletedUsers(normalizedDeletedUsers);
  }, []);

  React.useEffect(() => {
    loadUsers();
    loadDeletedUsers();
  }, [loadUsers, loadDeletedUsers]);

  const handleDelete = (email) => {
    const currentUsers = JSON.parse(localStorage.getItem("mockUsers")) || [];
    const deleted = JSON.parse(localStorage.getItem("deletedMockUsers")) || [];
    const targetUser = currentUsers.find((user) => user.emailAddress === email);

    if (targetUser) {
      const nextDeleted = [
        ...deleted.filter((user) => user.emailAddress !== email),
        {
          ...targetUser,
          deletedAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem("deletedMockUsers", JSON.stringify(nextDeleted));
    }

    const nextUsers = currentUsers.filter((user) => user.emailAddress !== email);
    localStorage.setItem("mockUsers", JSON.stringify(nextUsers));

    loadUsers();
    loadDeletedUsers();
  };

  const handleRestore = (email) => {
    const currentUsers = JSON.parse(localStorage.getItem("mockUsers")) || [];
    const deleted = JSON.parse(localStorage.getItem("deletedMockUsers")) || [];

    const restoreTarget = deleted.find((user) => user.emailAddress === email);
    if (!restoreTarget) return;

    const nextUsers = [
      ...currentUsers.filter((user) => user.emailAddress !== email),
      restoreTarget,
    ];

    const nextDeleted = deleted.filter((user) => user.emailAddress !== email);

    localStorage.setItem("mockUsers", JSON.stringify(nextUsers));
    localStorage.setItem("deletedMockUsers", JSON.stringify(nextDeleted));

    loadUsers();
    loadDeletedUsers();
  };

  const activeList = showDeleted ? deletedUsers : users;

  const filteredUsers = activeList.filter((user) => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) return true;
    return (
      (user.userId || "").toLowerCase().includes(keyword) ||
      (user.fullName || "").toLowerCase().includes(keyword) ||
      (user.emailAddress || "").toLowerCase().includes(keyword)
    );
  });

    return (
        <div className="min-h-screen bg-[#FDF8FD] text-on-surface font-[Lexend] flex">
                  
                  <AdminSidebar />
            
                  <div className="flex-1 flex flex-col h-screen overflow-y-auto">
            
                    
            
              {/* Main */}
              <main className="flex-1 px-6 md:px-10 mt-2 md:mt-0 pt-10">
                
                {/* Header */}
                <h2 className="text-3xl font-extrabold mb-6 flex">
                    Manage Users
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
              ? `View Active (${users.length})`
              : `View Deleted (${deletedUsers.length})`}
          </button>
          
        </div>
                  

                  <table className="w-full my-6 bg-white rounded-xl overflow-hidden">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b">
              <th className="p-4">User ID</th>
              <th className="p-4">User</th>
              <th className="p-4 flex items-center justify-center">City</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Requests</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-gray-500">
                  {showDeleted ? "No deleted users found." : "No users found."}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.userId || user.emailAddress} className="border-b last:border-0">
                  <td className="p-4 font-semibold text-[#4C3A78]">{user.userId || "-"}</td>
                  <td className="p-4">
                    <p className="font-semibold flex">{user.fullName || "-"}</p>
                    <p className="text-sm text-gray-500 flex">{user.emailAddress || "-"}</p>
                  </td>
                  <td className="p-4">{user.city || "-"}</td>
                  <td className="p-4">{user.rating ?? "-"}</td>
                  <td className="p-4">{user.request ?? 0}</td>
                  <td className="p-4">{user.phoneNumber || "-"}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {!showDeleted && (
                        <button
                          type="button"
                          onClick={() => handleDelete(user.emailAddress)}
                          className="px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      )}
                      {showDeleted && (
                        <button
                          type="button"
                          onClick={() => handleRestore(user.emailAddress)}
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