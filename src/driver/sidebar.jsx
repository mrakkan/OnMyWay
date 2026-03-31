import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

const WEATHER_CITY = import.meta.env.VITE_WEATHER_CITY || "Bangkok";
const WEATHER_API_KEY = import.meta.env.VITE_WEATHERAPI_KEY;

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
    const [weather, setWeather] = useState(null);
    const [weatherError, setWeatherError] = useState("");

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

    useEffect(() => {
        if (!WEATHER_API_KEY) {
            setWeatherError("กรุณาตั้งค่า VITE_WEATHERAPI_KEY");
            return;
        }

        const controller = new AbortController();

        const fetchWeather = async () => {
            try {
                const response = await fetch(
                    `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(WEATHER_CITY)}&lang=th`,
                    { signal: controller.signal }
                );

                if (!response.ok) {
                    throw new Error("weather fetch failed");
                }

                const data = await response.json();
                setWeather({
                    city: data.location?.name || WEATHER_CITY,
                    temp: Math.round(data.current?.temp_c ?? 0),
                    description: data.current?.condition?.text || "",
                    icon: data.current?.condition?.icon || "",
                });
                setWeatherError("");
            } catch (error) {
                if (error.name === "AbortError") return;
                setWeatherError("โหลดอากาศไม่สำเร็จ");
            }
        };

        fetchWeather();

        return () => {
            controller.abort();
        };
    }, []);

    const isRestrictedMenu = approvalStatus === "pending" || approvalStatus === "rejected";
    const menuBaseClass = "p-4 mt-2 flex items-center rounded-xl transition";
    const getMenuClassName = ({ isActive }) =>
        `${menuBaseClass} ${
            isActive
                ? "bg-[#E7E0EB] text-[#684CB5] font-semibold"
                : "text-[#64748B] hover:bg-[#E7E0EB] hover:text-[#684CB5] hover:font-semibold"
        }`;
    const todayLabel = new Date().toLocaleDateString("th-TH", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    });

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
                        <NavLink to="/my-request" className={getMenuClassName}>
                            <span className="material-symbols-outlined">
                                directions_car
                            </span>
                            <span className="ml-2">My Request</span>
                        </NavLink>

                        {!isRestrictedMenu && (
                            <>
                                <NavLink to="/my-works" className={getMenuClassName}>
                                    <span className="material-symbols-outlined">
                                        work
                                    </span>
                                    <span className="ml-2">My Works</span>
                                </NavLink>
                                <NavLink to="/profile" className={getMenuClassName}>
                                    <span className="material-symbols-outlined">
                                        person
                                    </span>
                                    <span className="ml-2">Profile</span>
                                </NavLink>

                                <NavLink to="/dashboard" className={getMenuClassName}>
                                    <span className="material-symbols-outlined">
                                        dashboard
                                    </span>
                                    <span className="ml-2">Dashboard</span>
                                </NavLink>
                            </>
                        )}

                        <NavLink to="/help-center" className={getMenuClassName}>
                            <span className="material-symbols-outlined">
                                help
                            </span>
                            <span className="ml-2">Help Center</span>
                        </NavLink>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto p-4">
                    <div className="rounded-2xl bg-white/80 border border-[#E2D6F2] p-3 mb-3 text-left">
                        <p className="text-sm font-medium text-[#7A6F94]">{todayLabel}</p>
                        {weather ? (
                            <div className="mt-2 flex items-center justify-between gap-2">
                                <div>
                                    <p className="text-sm font-semibold text-[#4C3A78]">{weather.city}</p>
                                    <p className="text-xs text-[#6F5D98] capitalize">{weather.description}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    {weather.icon && (
                                        <img
                                            src={weather.icon.startsWith("//") ? `https:${weather.icon}` : weather.icon}
                                            alt="weather"
                                            className="w-9 h-9"
                                        />
                                    )}
                                    <p className="text-lg font-bold text-[#4C3A78]">{weather.temp}°C</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-[#8C7FA8] mt-2">{weatherError || "กำลังโหลดอากาศ..."}</p>
                        )}
                    </div>

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