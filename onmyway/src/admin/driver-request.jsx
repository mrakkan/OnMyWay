import React from "react";
import AdminSidebar from "./sidebar";
import mockDriverRequests from "./mock-driver-requests.json";

export default function DriverRequest() {
    const [drivers, setDrivers] = React.useState([]);
    const [dismissedEmails, setDismissedEmails] = React.useState([]);
    const [filter, setFilter] = React.useState("pending"); // all | pending | approved | rejected | hidden

    const loadDrivers = React.useCallback(() => {
        const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

        // merge mock + stored (stored overrides mock by email)
        const mergedUsersMap = new Map();
        mockDriverRequests.forEach((user) => mergedUsersMap.set(user.email, user));
        storedUsers.forEach((user) => mergedUsersMap.set(user.email, user));

        const users = Array.from(mergedUsersMap.values());

        // if there are no stored users, seed localStorage with mock data
        if (storedUsers.length === 0) {
            localStorage.setItem("users", JSON.stringify(users));
        }

        setDrivers(users);
    }, []);

    React.useEffect(() => {
        loadDrivers();
    }, [loadDrivers]);

    const updateDriverStatus = (driver, nextStatus) => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const existingIndex = users.findIndex((user) => user.email === driver.email);
        const nextDriverData = { ...driver, driverApprovalStatus: nextStatus };

        let updatedUsers = [...users];
        if (existingIndex >= 0) {
            updatedUsers[existingIndex] = { ...updatedUsers[existingIndex], ...nextDriverData };
        } else {
            updatedUsers.push(nextDriverData);
        }

        localStorage.setItem("users", JSON.stringify(updatedUsers));
        loadDrivers();
        // if was dismissed, remove from dismissed so it reappears in view if filter allows
        setDismissedEmails((prev) => prev.filter((e) => e !== driver.email));
    };

    const dismissRequestTemporarily = (email) => {
        setDismissedEmails((prev) => (prev.includes(email) ? prev : [...prev, email]));
    };

    const computedLists = React.useMemo(() => {
        const pending = drivers.filter((d) => !d.driverApprovalStatus || d.driverApprovalStatus === "pending");
        const approved = drivers.filter((d) => d.driverApprovalStatus === "approved");
        const rejected = drivers.filter((d) => d.driverApprovalStatus === "rejected");
        const visiblePending = pending.filter((d) => !dismissedEmails.includes(d.email));
        const visibleApproved = approved.filter((d) => !dismissedEmails.includes(d.email));
        const visibleRejected = rejected.filter((d) => !dismissedEmails.includes(d.email));

        return {
            all: drivers.filter((d) => !dismissedEmails.includes(d.email)),
            pending: visiblePending,
            approved: visibleApproved,
            rejected: visibleRejected,
            hidden: drivers.filter((d) => dismissedEmails.includes(d.email)),
            counts: {
                all: drivers.length,
                pending: pending.length,
                approved: approved.length,
                rejected: rejected.length,
                hidden: dismissedEmails.length,
            },
        };
    }, [drivers, dismissedEmails]);

    const visibleRequests = computedLists[filter] || [];

    return (
        <div className="min-h-screen bg-[#FDF8FD] text-on-surface font-[Lexend] flex">
            <AdminSidebar />

            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                <main className="flex-1 px-6 md:px-10 mt-2 md:mt-0 pt-10">
                <h2 className="text-3xl font-extrabold mb-2 flex">
                    Drivers Request
                </h2>
                <div className="flex items-center justify-between gap-4 mb-4">
                    <p className="text-gray-500 flex">Drivers</p>
                    <div className="flex gap-2">
                        <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded ${filter==='all' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>
                            All ({computedLists.counts.all})
                        </button>
                        <button onClick={() => setFilter('pending')} className={`px-3 py-1 rounded ${filter==='pending' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>
                            Pending ({computedLists.counts.pending})
                        </button>
                        <button onClick={() => setFilter('approved')} className={`px-3 py-1 rounded ${filter==='approved' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>
                            Approved ({computedLists.counts.approved})
                        </button>
                        <button onClick={() => setFilter('rejected')} className={`px-3 py-1 rounded ${filter==='rejected' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>
                            Rejected ({computedLists.counts.rejected})
                        </button>
                        <button onClick={() => setFilter('hidden')} className={`px-3 py-1 rounded ${filter==='hidden' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>
                            Hidden ({computedLists.counts.hidden})
                        </button>
                    </div>
                </div>

                {visibleRequests.length === 0 ? (
                    <div className="bg-white rounded-xl p-6 shadow text-gray-600">
                        No drivers in this view.
                    </div>
                ) : (
                    <div className="space-y-4 pb-8">
                        {visibleRequests.map((driver) => (
                            <div key={driver.email} className="bg-white rounded-xl p-6 shadow">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xl font-bold flex">{driver.fullName || "-"} {driver.driverApprovalStatus === 'approved' && (<span className="ml-2 text-xs bg-green-100 text-green-700 px-2 rounded">APPROVED</span>)} {driver.driverApprovalStatus === 'rejected' && (<span className="ml-2 text-xs bg-red-100 text-red-700 px-2 rounded">REJECTED</span>)}</p>
                                        <p className="text-sm text-gray-500 flex">{driver.email || "-"}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {driver.driverApprovalStatus !== 'approved' && (
                                            <button
                                                type="button"
                                                onClick={() => updateDriverStatus(driver, "approved")}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                                            >
                                                Approve
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => updateDriverStatus(driver, "rejected")}
                                            className="w-10 h-10 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 flex items-center justify-center font-bold"
                                            aria-label={`Reject ${driver.fullName}`}
                                        >
                                            X
                                        </button>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 mt-4 text-sm">
                                    <p className="flex"><span className="font-semibold mr-2">Phone:</span>{driver.phone || "-"}</p>
                                    <p className="flex"><span className="font-semibold mr-2">National ID:</span>{driver.nationalId || "-"}</p>
                                    <p className="flex"><span className="font-semibold mr-2">DOB:</span>{driver.dob || "-"}</p>
                                    <p className="flex"><span className="font-semibold mr-2">Vehicle:</span>{driver.vehicleModel || "-"} ({driver.vehicleYear || "-"})</p>
                                    <p className="md:col-span-2 flex"><span className="font-semibold mr-2">Care Background:</span>{driver.careBackground?.length ? driver.careBackground.join(", ") : "-"}</p>
                                    <p className="md:col-span-2 flex"><span className="font-semibold mr-2">Other certifications:</span>{driver.otherCertifications || "-"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                </main>
            </div>
        </div>
    );
}