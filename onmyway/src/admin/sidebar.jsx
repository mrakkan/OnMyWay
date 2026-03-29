import { Link } from "react-router-dom";
import { useState } from "react";

export default function AdminSidebar() {
    const [open, setOpen] = useState(false);

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
                        <Link to="/admin/dashboard" className="p-4 mt-2 flex items-center rounded-xl hover:bg-[#E7E0EB] text-[#64748B] hover:text-[#684CB5] hover:font-semibold ">
                            <span className="material-symbols-outlined">
                                dashboard
                            </span>
                            <span className="ml-2">Dashboard</span>
                        </Link>
                        <Link to="/admin/manage-driver" className="p-4 mt-2 flex items-center rounded-xl hover:bg-[#E7E0EB] text-[#64748B] hover:text-[#684CB5] hover:font-semibold ">
                            <span className="material-symbols-outlined">
                                directions_car
                            </span>
                            <span className="ml-2">Manage Driver</span>
                        </Link>
                        <Link to="/admin/driver-request" className="p-4 mt-2 flex items-center rounded-xl hover:bg-[#E7E0EB] text-[#64748B] hover:text-[#684CB5] hover:font-semibold ">
                            <span className="material-symbols-outlined">
                                assignment
                            </span>
                            <span className="ml-2">Driver Request</span>
                        </Link>
                        <Link to="" className="p-4 mt-2 flex items-center rounded-xl hover:bg-[#E7E0EB] text-[#64748B] hover:text-[#684CB5] hover:font-semibold ">
                            <span className="material-symbols-outlined">
                                person
                            </span>
                            <span className="ml-2">Manage Users</span>
                        </Link>
                        <Link to="/help" className="p-4 mt-2 flex items-center rounded-xl hover:bg-[#E7E0EB] text-[#64748B] hover:text-[#684CB5] hover:font-semibold ">
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