import React from "react";

export default function DriverRegistration() {
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
        }
    };
    return (
        <div className="bg-[#fdf8fd] text-on-surface min-h-screen">
            <div className="pt-10 px-4 flex justify-end">
                <p>Already have an account? <a href="/login" className="text-primary p-2 ml-2 border border-purple-600 rounded-xl hover:bg-purple-600 hover:text-white">Log in</a></p>

            </div>

            <main className="pt-5 pb-10 px-4 flex flex-col items-center">
                {/* Card */}
                <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">

                    {/* Header */}
                    <div className="p-10 text-center border-b">
                        <h1 className="text-4xl font-bold mb-4">
                            Join our care team
                        </h1>
                        <p className="text-gray-500">
                            Help us provide dignified transportation for seniors.
                        </p>
                    </div>

                    <form className="p-10 space-y-12"
                        onSubmit={handleSubmit}
                    >

                        {/* Personal Info */}
                        <section>
                            <h2 className="text-xl font-bold mb-6 flex items-center">
                                <span className="material-symbols-outlined text-2xl rounded-full bg-pink-200 text-white p-1 mr-2 w-10 h-10 flex items-center justify-center">
                                    person
                                </span>

                                Personal Information
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6 ">
                                <div className="flex flex-col gap-2">
                                    <label className="font-medium flex">
                                        Full Name
                                    </label>
                                    <input
                                        className="h-12 bg-gray-100 rounded-xl px-4"
                                        placeholder="Full name"
                                        required
                                        name="fullName"
                                        value={form.fullName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-medium flex">
                                        Date of Birth
                                    </label>
                                    <input type="date"
                                        className={`h-12 bg-gray-100 rounded-xl px-4 ${errors.dob ? "border border-red-400" : ""}`}
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
                                    <label className="font-medium flex">
                                        Phone Number
                                    </label>
                                    <input type="number"
                                        className={`h-12 bg-gray-100 rounded-xl px-4 ${errors.phone ? "border border-red-400" : ""}`}
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
                                    <label className="font-medium flex">
                                        National ID
                                    </label>
                                    <input type="number"
                                        className={`h-12 bg-gray-100 rounded-xl px-4 ${errors.nationalId ? "border border-red-400" : ""}`}
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
                            <h2 className="text-xl font-bold mb-6 flex items-center">
                                <span className="material-symbols-outlined text-2xl rounded-full bg-blue-200 text-white p-1 mr-2 w-10 h-10 flex items-center justify-center">
                                    medical_services
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
                                        className="flex justify-between items-center p-4 bg-gray-100 rounded-xl cursor-pointer"
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
                                <label className="font-medium flex">
                                    Other certifications or experience
                                </label>
                                <input
                                    type="text"
                                    className="h-12 bg-gray-100 rounded-xl px-4"
                                    placeholder="Please specify"
                                    name="otherCertifications"
                                    value={form.otherCertifications}
                                    onChange={handleChange}
                                />
                            </div>
                        </section>

                        {/* Vehicle */}
                        <section>
                            <h2 className="text-xl font-bold mb-6 flex items-center">
                                <span className="material-symbols-outlined text-2xl rounded-full bg-purple-300 text-white p-1 mr-2 w-10 h-10 flex items-center justify-center">
                                    directions_car
                                </span>
                                Vehicle Details
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="font-medium flex">
                                        Make & Model
                                    </label>
                                    <input
                                        className="h-12 bg-gray-100 rounded-xl px-4 md:col-span-2"
                                        placeholder="Make & Model"
                                        required
                                        name="vehicleModel"
                                        value={form.vehicleModel}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-medium flex">
                                        Year
                                    </label>
                                    <input type="number" required
                                        className="h-12 bg-gray-100 rounded-xl px-4"
                                        placeholder="Year"
                                        name="vehicleYear"
                                        value={form.vehicleYear}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-6 flex items-center">
                                <span className="material-symbols-outlined text-2xl rounded-full bg-yellow-200 text-white p-1 mr-2 w-10 h-10 flex items-center justify-center">
                                    account_circle
                                </span>


                                Create Account
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="font-medium flex">
                                        Email Address
                                    </label>
                                    <input
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className={`h-12 bg-gray-100 rounded-xl px-4 ${errors.email ? "border border-red-400" : ""
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
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <label>Password</label>

                                    </div>

                                    <div className="relative mt-2">

                                        {/* left icon */}
                                        <div className="absolute left-5 inset-y-0 flex items-center">
                                            <span className="material-symbols-outlined text-gray-400 text-2xl">
                                                lock
                                            </span>
                                        </div>

                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className={`w-full h-14 pl-14 pr-14 rounded-lg bg-gray-100 outline-none ${errors.password ? "border border-red-400" : ""}`}
                                        />


                                        {/* right icon */}
                                        <div className="absolute right-5 inset-y-0 flex items-center">
                                            <span
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="cursor-pointer material-symbols-outlined text-gray-400 text-2xl"
                                            >
                                                {showPassword ? "visibility_off" : "visibility"}
                                            </span>
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
                                className="px-8 py-4 bg-purple-600 text-white rounded-full font-bold"
                            >
                                Submit
                            </button>
                        </div>

                    </form>
                </div>
            </main>
        </div>
    );
}