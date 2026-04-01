import React from "react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AdminSidebar from "./sidebar";
export default function SeeProfile() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const selectedEmail = (searchParams.get("email") || "").toLowerCase();

    const [profilePreview, setProfilePreview] = useState(
        "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
    );
    const [form, setForm] = useState({
        price: "",
        area: "",
        experience: "",
        vehicle: "",
        bio: "",
        startTime: "",
        endTime: "",
    });

    const [selectedDays, setSelectedDays] = useState([]);
    const [personalForm, setPersonalForm] = useState({
        fullName: "",
        dob: "",
        phone: "",
        nationalId: "",
        email: "",
        vehicleModel: "",
        vehicleYear: "",
    });

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const toggleDay = (day) => {
        setSelectedDays((prev) =>
            prev.includes(day)
                ? prev.filter((d) => d !== day)
                : [...prev, day]
        );
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "profilePicture") {
            const file = files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (typeof reader.result === "string") {
                        setProfilePreview(reader.result);
                    }
                };
                reader.readAsDataURL(file);
            }
        } else {
            setForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        setPersonalForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    React.useEffect(() => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        const matchedUser =
            users.find((u) => u.email?.toLowerCase() === selectedEmail) ||
            users.find(
                (u) =>
                    u.email?.toLowerCase() ===
                    currentUser?.email?.toLowerCase()
            ) || currentUser || users[users.length - 1] || null;

        if (matchedUser) {
            setPersonalForm({
                fullName: matchedUser.fullName || "",
                dob: matchedUser.dob || "",
                phone: matchedUser.phone || "",
                nationalId: matchedUser.nationalId || "",
                email: matchedUser.email || "",
                vehicleModel: matchedUser.vehicleModel || "",
                vehicleYear: matchedUser.vehicleYear || "",
            });

            if (matchedUser.profileSettings) {
                setForm((prev) => ({
                    ...prev,
                    ...matchedUser.profileSettings,
                }));
                setSelectedDays(matchedUser.profileSettings.workingDays || []);
            }

            if (matchedUser.profilePreview) {
                setProfilePreview(matchedUser.profilePreview);
            }
        }
    }, [selectedEmail]);
    return (
        <div className="min-h-screen bg-[#FDF8FD] text-on-surface font-[Lexend] flex">
            <AdminSidebar />

            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                <header className="pt-5 px-8 flex items-center justify-end">
                    <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 rounded-lg border border-purple-300 text-purple-700 hover:bg-purple-50 transition mb-6 flex items-center gap-1 w-max"
                        >
                            ย้อนกลับ
                        </button>
                </header>

                <main className="flex-1 px-6 md:px-10  md:mt-0">
                    
                    <header className="mb-4 flex">
                        <div className="flex items-center gap-2">
                            <h2 className="text-3xl font-extrabold  flex">Profile Management</h2>

                        </div>
                        

                        {/* Toggle */}
                        {/* <div className="bg-gray-100 rounded-xl p-4 flex items-center gap-6">
                            <span className="font-bold">Available</span>
                            <input type="checkbox" defaultChecked />
                        </div> */}
                    </header>
                    {/* Content */}
                    <div className="grid grid-cols-12 gap-6">

                        {/* Form */}
                        <section className="col-span-12 lg:col-span-7 space-y-4 mb-10 pointer-events-none">
                            <div className="bg-[#FFFFFF] rounded-2xl p-8 shadow-sm border border-outline-variant/30">

                                {/* Title */}
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-on-surface">
                                        Service Configuration
                                    </h2>
                                    <p className="text-sm text-on-surface-variant mt-1">
                                        ตั้งค่าการให้บริการของคุณ
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* Price */}
                                    <div>
                                        <label className="block text-xs font-semibold mb-2 uppercase flex">
                                            Hourly Price
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold">
                                                ฿
                                            </span>
                                            <input
                                                type="number"
                                                name="price"
                                                value={form.price}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-100"
                                            />
                                        </div>
                                    </div>

                                    {/* Area */}
                                    <div>
                                        <label className="block text-xs font-semibold mb-2 uppercase flex">
                                            Service Area
                                        </label>
                                        <select
                                            name="area"
                                            value={form.area}
                                            onChange={handleChange}
                                            className="w-full py-3 px-4 border rounded-xl bg-gray-100"
                                        >
                                            <option>กรุงเทพมหานคร</option>
                                            <option>นนทบุรี</option>
                                            <option>ปทุมธานี</option>
                                        </select>
                                    </div>

                                    {/* Experience */}
                                    <div>
                                        <label className="block text-xs font-semibold mb-2 uppercase flex">
                                            Experience (Years)
                                        </label>
                                        <input
                                            type="number"
                                            name="experience"
                                            value={form.experience}
                                            onChange={handleChange}
                                            className="w-full py-3 px-4 border rounded-xl bg-gray-100"
                                        />
                                    </div>

                                    {/* Vehicle */}
                                    <div>
                                        <label className="block text-xs font-semibold mb-2 uppercase flex">
                                            Vehicle Type
                                        </label>
                                        <select
                                            name="vehicle"
                                            value={form.vehicle}
                                            onChange={handleChange}
                                            className="w-full py-3 px-4 border rounded-xl bg-gray-100"
                                        >
                                            <option>Sedan</option>
                                            <option>Van</option>
                                            <option>Wheelchair Accessible</option>
                                        </select>
                                    </div>

                                    {/* Working Days */}
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold mb-3 uppercase">
                                            Working Days
                                        </label>

                                        <div className="flex flex-wrap gap-2">
                                            {days.map((day) => (
                                                <button
                                                    key={day}
                                                    type="button"
                                                    onClick={() => toggleDay(day)}
                                                    className={`px-4 py-2 rounded-full border text-sm transition
                    ${selectedDays.includes(day)
                                                            ? "bg-purple-500 text-white border-primary"
                                                            : "border-gray-300 hover:bg-purple-500 hover:text-white"
                                                        }
                  `}
                                                >
                                                    {day}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Start Time */}
                                    <div>
                                        <label className="block text-xs font-semibold mb-2 uppercase flex">
                                            Start Time
                                        </label>
                                        <input
                                            type="time"
                                            name="startTime"
                                            value={form.startTime}
                                            onChange={handleChange}
                                            className="w-full py-3 px-4 border rounded-xl bg-gray-100"
                                        />
                                    </div>

                                    {/* End Time */}
                                    <div>
                                        <label className="block text-xs font-semibold mb-2 uppercase flex">
                                            End Time
                                        </label>
                                        <input
                                            type="time"
                                            name="endTime"
                                            value={form.endTime}
                                            onChange={handleChange}
                                            className="w-full py-3 px-4 border rounded-xl bg-gray-100"
                                        />
                                    </div>

                                    {/* Bio */}
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold mb-2 uppercase flex">
                                            Description
                                        </label>
                                        <textarea
                                            rows="4"
                                            name="bio"
                                            value={form.bio}
                                            onChange={handleChange}
                                            className="w-full p-4 border rounded-xl bg-gray-100"
                                            placeholder="เล่าประสบการณ์ของคุณ..."
                                        />
                                    </div>



                                </div>

                                <div className="mt-8 text-sm text-gray-500">
                                    View only mode
                                </div>

                            </div>
                        </section>


                        {/* Preview */}
                        <aside className="col-span-12 lg:col-span-5 mb-10 pointer-events-none">
                            <div className="bg-white rounded-xl shadow p-6">

                                <h3 className="text-xl font-bold mb-2">
                                    Personal Profile
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    ข้อมูลส่วนตัว
                                </p>

                                {/* Profile Picture */}
                                <div className="md:col-span-2 flex flex-col items-center">


                                    <label className="relative cursor-pointer group">
                                        {/* รูป */}
                                        <img
                                            src={profilePreview}
                                            alt="profile"
                                            className="w-38 h-38 rounded-full object-cover border-4 border-white shadow-md"
                                        />

                                        {/* overlay hover */}
                                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                            <span className="text-white text-sm font-semibold">
                                                Change
                                            </span>
                                        </div>

                                        {/* input ซ่อน */}
                                        <input
                                            type="file"
                                            name="profilePicture"
                                            accept="image/*"
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                    </label>
                                    <label className="block text-xs font-semibold mb-3 uppercase flex mt-2">
                                        Profile Picture
                                    </label>
                                </div>

                                <div className="mt-6 space-y-3">
                                    <div>
                                        <label className="block text-xs font-semibold mb-1 uppercase flex">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={personalForm.fullName}
                                            onChange={handlePersonalChange}
                                            className="w-full py-3 px-4 border rounded-xl bg-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold mb-1 uppercase flex">
                                            Date of Birth
                                        </label>
                                        <input
                                            type="date"
                                            name="dob"
                                            value={personalForm.dob}
                                            onChange={handlePersonalChange}
                                            className="w-full py-3 px-4 border rounded-xl bg-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold mb-1 uppercase flex">
                                            Phone
                                        </label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={personalForm.phone}
                                            onChange={handlePersonalChange}
                                            className="w-full py-3 px-4 border rounded-xl bg-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold mb-1 uppercase flex">
                                            National ID
                                        </label>
                                        <input
                                            type="text"
                                            name="nationalId"
                                            value={personalForm.nationalId}
                                            onChange={handlePersonalChange}
                                            className="w-full py-3 px-4 border rounded-xl bg-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold mb-1 uppercase flex">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={personalForm.email}
                                            onChange={handlePersonalChange}
                                            className="w-full py-3 px-4 border rounded-xl bg-gray-100"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                        <label className="block text-xs font-semibold mb-1 uppercase flex">
                                            Vehicle Model
                                        </label>
                                        <input
                                            type="text"
                                            name="vehicleModel"
                                            value={personalForm.vehicleModel}
                                            onChange={handlePersonalChange}
                                            className="w-full py-3 px-4 border rounded-xl bg-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold mb-1 uppercase flex">
                                            Vehicle Year
                                        </label>
                                        <input
                                            type="text"
                                            name="vehicleYear"
                                            value={personalForm.vehicleYear}
                                            onChange={handlePersonalChange}
                                            className="w-full py-3 px-4 border rounded-xl bg-gray-100"
                                        />
                                    </div>
                                    </div>

                                    <div className="mt-8 text-sm text-gray-500">
                                        View only mode
                                    </div>
                                </div>

                            </div>
                        </aside>

                    </div>

                </main>
            </div>
        </div>
    );
}