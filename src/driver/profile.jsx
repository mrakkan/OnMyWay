import React from "react";
import DriverSidebar from "./sidebar";
import DriverTopHeader from "./top-header";
import { useState } from "react";
import LightWavesBackground from "../components/LightWavesBackground";

const SHARED_WAVES_COLORS = ["#7c3aed", "#8b5cf6", "#a78bfa", "#6d28d9", "#9333ea"];

export default function Profile() {
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
    const [originalEmail, setOriginalEmail] = useState("");
    const inputClassName =
        "w-full py-3 px-4 rounded-2xl bg-[#efe8f8] border border-white/70 focus:outline-none focus:ring-2 focus:ring-violet-300";
    const textareaClassName =
        "w-full p-4 rounded-2xl bg-[#efe8f8] border border-white/70 focus:outline-none focus:ring-2 focus:ring-violet-300";

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

            setOriginalEmail(matchedUser.email || "");

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
    }, []);

    const saveProfileData = ({ requireServiceValidation = false } = {}) => {
        if (requireServiceValidation) {
            if (!form.startTime || !form.endTime) {
                alert("กรุณาเลือกเวลาให้ครบ");
                return;
            }

            if (selectedDays.length === 0) {
                alert("กรุณาเลือกวันทำงาน");
                return;
            }

            if (form.endTime <= form.startTime) {
                alert("เวลาเลิกงานต้องมากกว่าเวลาเริ่ม");
                return;
            }
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
        const normalizedEmail = personalForm.email.trim().toLowerCase();
        const normalizedOriginalEmail = originalEmail.trim().toLowerCase();

        if (!normalizedEmail) {
            alert("กรุณากรอกอีเมล");
            return;
        }

        const duplicateEmail = users.find(
            (u) =>
                u.email?.toLowerCase() === normalizedEmail &&
                u.email?.toLowerCase() !== normalizedOriginalEmail
        );

        if (duplicateEmail) {
            alert("อีเมลนี้ถูกใช้งานแล้ว");
            return;
        }

        const profileSettings = {
            ...form,
            workingDays: selectedDays,
        };

        const targetIndex = users.findIndex(
            (u) => u.email?.toLowerCase() === normalizedOriginalEmail
        );

        const baseUser = targetIndex >= 0 ? users[targetIndex] : currentUser;

        const updatedUser = {
            ...baseUser,
            ...personalForm,
            profileSettings,
            profilePreview,
        };

        if (targetIndex >= 0) {
            users[targetIndex] = {
                ...users[targetIndex],
                ...updatedUser,
            };
        } else {
            users.push(updatedUser);
        }

        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        setOriginalEmail(personalForm.email);

        alert("บันทึกสำเร็จ!");
    };

    const handleSubmit = () => {
        saveProfileData({ requireServiceValidation: true });
    };

    const handlePersonalSave = () => {
        saveProfileData();
    };
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
                    <DriverTopHeader
                        profilePreview={profilePreview}
                        fullName={personalForm.fullName}
                    />

                    <main className="flex-1 pt-3 pb-10 lg:pb-14">
                        <div className="mx-auto w-full max-w-[1240px] px-5 lg:px-8">
                            <header className="mb-6 flex justify-between items-end">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-3xl font-extrabold flex text-[#24143f]">Profile Management</h2>
                                </div>
                            </header>

                            <div className="grid grid-cols-12 gap-6">

                        {/* Form */}
                        <section className="col-span-12 lg:col-span-7 space-y-4 mb-10">
                            <div className="sun-card sun-card--review p-6 sm:p-8 border border-violet-100/40">

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
                                        <div className="relative ">
                                            <span className="absolute left-4   pr-4 py-3 font-bold flex items-center">
                                                ฿
                                            </span>
                                            <input
                                                type="number"
                                                name="price"
                                                value={form.price}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#efe8f8] border border-white/70 focus:outline-none focus:ring-2 focus:ring-violet-300"
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
                                            className={inputClassName}
                                        >
                                            <option>กรุงเทพมหานคร</option>
                                            <option>นนทบุรี</option>
                                            <option>ปทุมธานี</option>
                                        </select>
                                    </div>

                                    {/* Experience */}
                                    <div>
                                        <label className="block text-xs font-semibold mb-2 uppercase flex">
                                            License plate
                                        </label>
                                        <input
                                            type="number"
                                            name="experience"
                                            value={form.experience}
                                            onChange={handleChange}
                                            className={inputClassName}
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
                                            className={inputClassName}
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
                                                            ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                                                            : "bg-white/80 border-violet-200 text-violet-700 hover:bg-violet-50"
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
                                            className={inputClassName}
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
                                            className={inputClassName}
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
                                            className={textareaClassName}
                                            placeholder="เล่าประสบการณ์ของคุณ..."
                                        />
                                    </div>



                                </div>

                                {/* Button */}
                                <div className="mt-10 flex justify-end">
                                    <button
                                        onClick={handleSubmit}
                                        className="px-8 py-3 bg-violet-600 text-white rounded-2xl font-semibold hover:bg-violet-700 transition"
                                    >
                                        Save Changes
                                    </button>
                                </div>

                            </div>
                        </section>


                        {/* Preview */}
                        <aside className="col-span-12 lg:col-span-5 mb-10">
                            <div className="sun-card sun-card--review p-6 border border-violet-100/40">

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
                                            className={inputClassName}
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
                                            className={inputClassName}
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
                                            className={inputClassName}
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
                                            className={inputClassName}
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
                                            className={inputClassName}
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
                                            className={inputClassName}
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
                                            className={inputClassName}
                                        />
                                    </div>
                                    </div>

                                    <div className="mt-10 flex justify-end ">
                                    <button
                                        type="button"
                                        onClick={handlePersonalSave}
                                        className="px-8 py-3 bg-violet-600 text-white rounded-2xl font-semibold hover:bg-violet-700 transition"
                                    >
                                        Save
                                    </button>
                                </div>
                                </div>

                            </div>
                        </aside>

                    </div>

                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}