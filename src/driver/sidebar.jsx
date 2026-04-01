import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

const WEATHER_CITY = import.meta.env.VITE_WEATHER_CITY || "Bangkok";

const WEATHER_CODE_LOOKUP = {
    0: { label: "ท้องฟ้าแจ่มใส", icon: "wb_sunny" },
    1: { label: "ฟ้าโปร่ง", icon: "light_mode" },
    2: { label: "เมฆบางส่วน", icon: "partly_cloudy_day" },
    3: { label: "เมฆมาก", icon: "cloud" },
    45: { label: "มีหมอก", icon: "foggy" },
    48: { label: "หมอกหนา", icon: "foggy" },
    51: { label: "ฝนปรอย", icon: "grain" },
    53: { label: "ฝนเล็กน้อย", icon: "rainy_light" },
    55: { label: "ฝนปานกลาง", icon: "rainy" },
    61: { label: "ฝน", icon: "rainy" },
    63: { label: "ฝนปานกลาง", icon: "rainy_heavy" },
    65: { label: "ฝนหนัก", icon: "thunderstorm" },
    71: { label: "หิมะบาง", icon: "weather_snowy" },
    73: { label: "หิมะ", icon: "weather_snowy" },
    75: { label: "หิมะหนัก", icon: "snowing" },
    80: { label: "ฝนเป็นช่วง", icon: "rainy_light" },
    81: { label: "ฝนเป็นช่วงปานกลาง", icon: "rainy" },
    82: { label: "ฝนเป็นช่วงหนัก", icon: "rainy_heavy" },
    95: { label: "พายุฝนฟ้าคะนอง", icon: "thunderstorm" },
};

const getWeatherInfoByCode = (code) => WEATHER_CODE_LOOKUP[code] || { label: "สภาพอากาศ", icon: "cloud" };

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
        const controller = new AbortController();

        const fetchWeather = async () => {
            try {
                const geocodeResponse = await fetch(
                    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(WEATHER_CITY)}&count=1&language=th&format=json`,
                    { signal: controller.signal }
                );

                if (!geocodeResponse.ok) {
                    throw new Error("geocoding failed");
                }

                const geocodeData = await geocodeResponse.json();
                const location = geocodeData?.results?.[0];

                if (!location?.latitude || !location?.longitude) {
                    throw new Error("location not found");
                }

                const weatherResponse = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,weather_code&timezone=auto`,
                    { signal: controller.signal }
                );

                if (!weatherResponse.ok) {
                    throw new Error("weather fetch failed");
                }

                const weatherData = await weatherResponse.json();
                const weatherCode = weatherData?.current?.weather_code;
                const weatherInfo = getWeatherInfoByCode(weatherCode);

                setWeather({
                    city: location.name || WEATHER_CITY,
                    temp: Math.round(weatherData?.current?.temperature_2m ?? 0),
                    description: weatherInfo.label,
                    icon: weatherInfo.icon,
                });
                setWeatherError("");
            } catch (error) {
                if (error.name === "AbortError") return;
                setWeatherError("โหลดอากาศไม่สำเร็จ");
            }
        };

        fetchWeather();

        const refreshTimer = window.setInterval(fetchWeather, 15 * 60 * 1000);

        return () => {
            controller.abort();
            window.clearInterval(refreshTimer);
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
                className="fixed  text-primary text-4xl top-5 left-4 cursor-pointer lg:!hidden material-symbols-outlined z-50"
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
                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-on-primary shadow-lg bg-purple-700">
                                <span className="material-symbols-outlined text-3xl">
                                    directions_car
                                </span>
                            </div>
                            <span className="text-lg font-bold tracking-tight text-primary text-purple-700">
                                ON MY WAY
                            </span>
                        </div>

                        {/* ปุ่มปิด (มือถือ) */}
                        <span className="material-symbols-outlined text-primary cursor-pointer lg:!hidden" onClick={() => setOpen(false)}>
                            close
                        </span>

                    </div>

                    {/* Menu */}
                    <div>
                        <NavLink to="/driver/my-request" className={getMenuClassName}>
                            <span className="material-symbols-outlined">
                                directions_car
                            </span>
                            <span className="ml-2">My Request</span>
                        </NavLink>

                        {!isRestrictedMenu && (
                            <>
                                <NavLink to="/driver/my-works" className={getMenuClassName}>
                                    <span className="material-symbols-outlined">
                                        work
                                    </span>
                                    <span className="ml-2">My Works</span>
                                </NavLink>
                                <NavLink to="/driver/profile" className={getMenuClassName}>
                                    <span className="material-symbols-outlined">
                                        person
                                    </span>
                                    <span className="ml-2">Profile</span>
                                </NavLink>

                                <NavLink to="/driver/dashboard" className={getMenuClassName}>
                                    <span className="material-symbols-outlined">
                                        dashboard
                                    </span>
                                    <span className="ml-2">Dashboard</span>
                                </NavLink>


                                <NavLink to="/driver/chat" className={getMenuClassName}>
                                    <span className="material-symbols-outlined">
                                        chat
                                    </span>
                                    <span className="ml-2">Chat</span>
                                </NavLink>
                            </>
                        )}

                        <NavLink to="/driver/help-center" className={getMenuClassName}>
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
                                    <p className="text-xs text-[#6F5D98]">{weather.description}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[#6B4BAF]">{weather.icon}</span>
                                    <p className="text-lg font-bold text-[#4C3A78]">{weather.temp}°C</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-[#8C7FA8] mt-2">{weatherError || "กำลังโหลดอากาศ..."}</p>
                        )}
                    </div>

                    <Link to="/driver/login" className="p-4 mt-2 flex items-center  text-[#64748B] hover:text-[#684CB5] hover:font-semibold ">
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