import React from "react";
import { Link, useNavigate } from "react-router-dom";
import BackgroundGradientAnimation from "../components/BackgroundGradientAnimation";

export default function DriverRegistration() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);
    const [password, setPassword] = React.useState("");
    const [errors, setErrors] = React.useState({});
    const [form, setForm] = React.useState({
        fullName: "",
        dob: "",
        phone: "",
        nationalId: "",
        email: "",
        careBackground: [],
        otherCertifications: "",
        vehicleModel: "",
        vehicleYear: "",
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };
    const handleCareBackgroundChange = (item) => {
        const isSelected = form.careBackground.includes(item);
        const updatedCareBackground = isSelected
            ? form.careBackground.filter((cert) => cert !== item)
            : [...form.careBackground, item];

        setForm({ ...form, careBackground: updatedCareBackground });
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        let newErrors = {};

        if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (form.phone.length !== 10) {
            newErrors.phone = "Phone number must be 10 digits";
        }

        if (form.nationalId.length !== 13) {
            newErrors.nationalId = "National ID must be 13 digits";
        }

        if (new Date(form.dob) > new Date()) {
            newErrors.dob = "Date of birth cannot be in the future";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            // ✅ รวมข้อมูลทั้งหมด
            const userData = {
                ...form,
                password,
            };

            // ✅ ดึง user เก่ามา
            const existingUsers =
                JSON.parse(localStorage.getItem("users")) || [];

            // ✅ check email ซ้ำ (สำคัญมาก)
            const isDuplicate = existingUsers.find(
                (u) => u.email === form.email
            );

            if (isDuplicate) {
                setErrors({ email: "This email is already registered" });
                return;
            }

            // ✅ เพิ่ม user ใหม่
            existingUsers.push(userData);

            // ✅ save กลับ
            localStorage.setItem("users", JSON.stringify(existingUsers));

            console.log("saved!", userData);

            // ✅ reset form
            setForm({
                fullName: "",
                dob: "",
                phone: "",
                nationalId: "",
                email: "",
                careBackground: [],
                otherCertifications: "",
                vehicleModel: "",
                vehicleYear: "",
            });
            setPassword("");

            alert("Register success 🎉");
            navigate("/driver/login");
        }
    };

    const inputClass = "w-full rounded-full bg-[#e5dfeb] px-4 py-3 sm:px-5 sm:py-3.5 text-sm sm:text-base placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-400";

    return (
        <div className="relative min-h-screen text-slate-800">
            <BackgroundGradientAnimation
                gradientBackgroundStart="rgb(243, 239, 247)"
                gradientBackgroundEnd="rgb(111, 76, 224)"
                firstColor="122, 90, 248"
                secondColor="147, 51, 234"
                thirdColor="196, 181, 253"
                fourthColor="129, 140, 248"
                fifthColor="168, 85, 247"
                pointerColor="124, 58, 237"
                size="88%"
                blendingValue="hard-light"
                className="pointer-events-none z-0"
                interactive
            />

            <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8 sm:py-6">
                <div className="flex items-center gap-2 text-violet-700">
                    <span className="text-xl sm:text-2xl font-bold tracking-tight">OnMyWay Driver</span>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                    <span className="hidden sm:block text-slate-600">Already have an account?</span>
                    <Link
                        to="/driver/login"
                        className="rounded-full border border-violet-200 px-4 py-2 sm:px-5 sm:py-2.5 font-semibold text-violet-700 transition hover:bg-violet-50"
                    >
                        Log In
                    </Link>
                </div>
            </div>

            <main className="relative z-10 mx-auto max-w-7xl px-4 pb-12 pt-2 sm:px-8 sm:pt-4">
                <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-[#e9e2f0] bg-[#f2edf7] p-5 sm:p-8 shadow-[0_18px_45px_-35px_rgba(76,49,134,0.5)]">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-800">Join our care team</h1>
                        <p className="mt-3 text-sm sm:text-base text-slate-600">
                            Help us provide dignified transportation for seniors.
                        </p>
                    </div>

                    <form className="space-y-10" onSubmit={handleSubmit}>

                        {/* Personal Info */}
                        <section>
                            <h2 className="mb-5 flex items-center gap-3 text-2xl sm:text-3xl font-black text-slate-800">
                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-white">
                                    <span className="material-symbols-outlined text-[18px] leading-none">person</span>
                                </span>
                                Personal Information
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6 ">
                                <div className="flex flex-col gap-2">
                                    <label className="font-semibold text-slate-700 flex">
                                        Full Name
                                    </label>
                                    <input
                                        className={inputClass}
                                        placeholder="Full name"
                                        required
                                        name="fullName"
                                        value={form.fullName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-semibold text-slate-700 flex">
                                        Date of Birth
                                    </label>
                                    <input type="date"
                                        className={`${inputClass} ${errors.dob ? "border border-red-400" : ""}`}
                                        placeholder="Date of Birth"
                                        required
                                        name="dob"
                                        value={form.dob}
                                        onChange={handleChange}
                                    />
                                    {errors.dob && (
                                        <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-semibold text-slate-700 flex">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        className={`${inputClass} ${errors.phone ? "border border-red-400" : ""}`}
                                        placeholder="Phone Number"
                                        required
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-semibold text-slate-700 flex">
                                        National ID
                                    </label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        className={`${inputClass} ${errors.nationalId ? "border border-red-400" : ""}`}
                                        placeholder="National ID"
                                        required
                                        name="nationalId"
                                        value={form.nationalId}
                                        onChange={handleChange}
                                    />
                                    {errors.nationalId && (
                                        <p className="text-red-500 text-sm mt-1">{errors.nationalId}</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Certifications */}
                        <section>
                            <h2 className="mb-5 flex items-center gap-3 text-2xl sm:text-3xl font-black text-slate-800">
                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-white">
                                    <span className="material-symbols-outlined text-[18px] leading-none">medical_services</span>
                                </span>
                                Care Background
                            </h2>

                            <div className="grid md:grid-cols-2 gap-4">

                                {[
                                    "On My Way Training",
                                    "Registered Nurse (RN)",
                                    "CPR Certified",
                                    "First Aid Basics",
                                ].map((item, i) => (
                                    <label
                                        key={i}
                                        className="flex justify-between items-center p-4 bg-[#e5dfeb] rounded-2xl cursor-pointer"
                                    >
                                        <span>{item}</span>
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 accent-purple-600 cursor-pointer "
                                            checked={form.careBackground.includes(item)}
                                            onChange={() => handleCareBackgroundChange(item)}
                                        />
                                    </label>
                                ))}

                            </div>

                            <div className="mt-4 flex flex-col gap-2">
                                <label className="font-semibold text-slate-700 flex">
                                    Other certifications or experience
                                </label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    placeholder="Please specify"
                                    name="otherCertifications"
                                    value={form.otherCertifications}
                                    onChange={handleChange}
                                />
                            </div>
                        </section>

                        {/* Vehicle */}
                        <section>
                            <h2 className="mb-5 flex items-center gap-3 text-2xl sm:text-3xl font-black text-slate-800">
                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-white">
                                    <span className="material-symbols-outlined text-[18px] leading-none">directions_car</span>
                                </span>
                                Vehicle Details
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="font-semibold text-slate-700 flex">
                                        Make & Model
                                    </label>
                                    <input
                                        className={inputClass}
                                        placeholder="Make & Model"
                                        required
                                        name="vehicleModel"
                                        value={form.vehicleModel}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-semibold text-slate-700 flex">
                                        Year
                                    </label>
                                    <input type="number" required
                                        className={inputClass}
                                        placeholder="Year"
                                        name="vehicleYear"
                                        value={form.vehicleYear}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="mb-5 flex items-center gap-3 text-2xl sm:text-3xl font-black text-slate-800">
                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-white">
                                    <span className="material-symbols-outlined text-[18px] leading-none">account_circle</span>
                                </span>
                                Create Account
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="font-semibold text-slate-700 flex">
                                        Email Address
                                    </label>
                                    <input
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className={`${inputClass} ${errors.email ? "border border-red-400" : ""
                                            }`}
                                        placeholder="Email Address"
                                        type="email"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="font-semibold text-slate-700">Password</label>

                                    <div className="relative mt-2">

                                        {/* left icon */}
                                        <div className="absolute left-4 inset-y-0 flex items-center text-slate-500">
                                            <span className="material-symbols-outlined text-xl">
                                                lock
                                            </span>
                                        </div>

                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className={`w-full rounded-full bg-[#e5dfeb] py-3 pl-12 pr-12 text-sm sm:text-base outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-violet-400 ${errors.password ? "border border-red-400" : ""}`}
                                        />


                                        {/* right icon */}
                                        <div className="absolute right-4 inset-y-0 flex items-center text-slate-400">
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="inline-flex cursor-pointer"
                                                aria-label="Toggle password visibility"
                                            >
                                                <span className="material-symbols-outlined text-xl">
                                                    {showPassword ? "visibility_off" : "visibility"}
                                                </span>
                                            </button>
                                        </div>

                                    </div>
                                    {errors.password && (
                                        <p className="text-red-500 text-sm mt-1 ml-1">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                            </div>
                        </section>

                        {/* Buttons */}
                        <div className="flex items-center justify-center">
                            <button
                                type="submit"
                                className="w-full rounded-full bg-violet-500 py-3.5 sm:py-4 text-lg sm:text-xl font-bold text-white shadow-[0_14px_30px_-20px_rgba(91,57,168,0.8)] transition hover:bg-violet-600 active:scale-[0.98]"
                            >
                                Submit Application →
                            </button>
                        </div>

                    </form>
                </div>
            </main>
        </div>
    );
}