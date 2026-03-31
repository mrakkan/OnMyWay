import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

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

export default function DriverSidebar() {
    const [open, setOpen] = useState(false);
    const [approvalStatus, setApprovalStatus] = useState(() => getCurrentDriverApprovalStatus());

    useEffect(() => {
        const syncApprovalStatus = () => {
            setApprovalStatus(getCurrentDriverApprovalStatus());
        };

        syncApprovalStatus();
        window.addEventListener("storage", syncApprovalStatus);

        return () => {
            window.removeEventListener("storage", syncApprovalStatus);
        };
    }, []);

    const isRestrictedMenu = approvalStatus === "pending" || approvalStatus === "rejected";

    return (
        <>
        
            {/* ปุ่มเปิด sidebar (มือถือ) */}
            <span
                className="fixed  text-primary text-4xl top-5 left-4 cursor-pointer lg:hidden material-symbols-outlined z-50"
                onClick={() => setOpen(true)}
            >
                menu
            </span>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 bottom-0 left-0 p-2 w-[280px] overflow-y-auto text-center bg-[#F2ECF5] shadow h-screen flex flex-col justify-between transition-transform duration-300 font-[Lexend] z-50 
                ${open ? "translate-x-0" : "-translate-x-full"} lg:static lg:translate-x-0 lg:w-[280px] lg:min-h-screen`}
            >
                <div className="text-white p-2">
                    {/* Header */}
                    <div className="p-2 mt-1 flex items-center justify-between rounded-md mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-on-primary shadow-lg">
                                <span className="material-symbols-outlined text-3xl">
                                    directions_car
                                </span>
                            </div>
                            <span className="text-lg font-bold tracking-tight text-primary">
                                ON MY WAY
                            </span>
                        </div>

                        {/* ปุ่มปิด (มือถือ) */}
                        <span className="material-symbols-outlined text-primary cursor-pointer lg:hidden" onClick={() => setOpen(false)}>
                            close
                        </span>

                    </div>

                    {/* Menu */}
                    <div>
                        <Link to="/my-request" className="p-4 mt-2 flex items-center rounded-xl hover:bg-[#E7E0EB] text-[#64748B] hover:text-[#684CB5] hover:font-semibold ">
                            <span className="material-symbols-outlined">
                                directions_car
                            </span>
                            <span className="ml-2">My Request</span>
                        </Link>

                        {!isRestrictedMenu && (
                            <>
                                <Link to="/my-works" className="p-4 mt-2 flex items-center rounded-xl hover:bg-[#E7E0EB] text-[#64748B] hover:text-[#684CB5] hover:font-semibold ">
                                    <span className="material-symbols-outlined">
                                        work
                                    </span>
                                    <span className="ml-2">My Works</span>
                                </Link>
                                <Link to="/profile" className="p-4 mt-2 flex items-center rounded-xl hover:bg-[#E7E0EB] text-[#64748B] hover:text-[#684CB5] hover:font-semibold ">
                                    <span className="material-symbols-outlined">
                                        person
                                    </span>
                                    <span className="ml-2">Profile</span>
                                </Link>

                                <Link to="/dashboard" className="p-4 mt-2 flex items-center rounded-xl hover:bg-[#E7E0EB] text-[#64748B] hover:text-[#684CB5] hover:font-semibold ">
                                    <span className="material-symbols-outlined">
                                        dashboard
                                    </span>
                                    <span className="ml-2">Dashboard</span>
                                </Link>
                            </>
                        )}

                        <Link to="/help-center" className="p-4 mt-2 flex items-center rounded-xl hover:bg-[#E7E0EB] text-[#64748B] hover:text-[#684CB5] hover:font-semibold ">
                            <span className="material-symbols-outlined">
                                help
                            </span>
                            <span className="ml-2">Help Center</span>
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto p-4">
                    <Link to="/login" className="p-4 mt-2 flex items-center  text-[#64748B] hover:text-[#684CB5] hover:font-semibold ">
                        <span className="material-symbols-outlined">
                            logout
                        </span>
                        <span className="ml-2">Sign Out</span>
                    </Link>
                </div>
            </aside>

            
        </>
    );
}