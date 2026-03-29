import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function DriverLogin() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const mockUsers = [
        {
            email: "driver1@test.com",
            password: "12345678",
            fullName: "Driver One",
        },
        {
            email: "driver2@test.com",
            password: "12345678",
            fullName: "Driver Two",
        },
    ];

    return (
        <div className="bg-[#fdf8fd] text-on-surface min-h-screen flex flex-col items-center justify-center relative overflow-hidden font-[Lexend]">

            {/* Background */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] bg-primary-container/20 rounded-full blur-[50px]" />
            <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[50%] bg-tertiary-container/30 rounded-full blur-[20px]" />

            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full px-12 py-8 flex justify-between items-center z-50">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-on-primary shadow-lg">
                        <span className="material-symbols-outlined text-3xl">
                            directions_car
                        </span>
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-primary">
                        ON MY WAY
                    </span>
                </div>
            </nav>

            <main className="w-full max-w-[1440px] flex items-center justify-center px-6 py-12">
                <div className="flex flex-col md:flex-row items-center gap-16 w-full max-w-6xl">

                    {/* Left Content */}
                    <div className="hidden md:flex flex-col gap-8 w-1/2">
                        <h1 className="text-6xl font-extrabold leading-[1.1] tracking-tighter">
                            Welcome back,<br />
                            <span className="text-primary">Driver Partner</span>
                        </h1>




                    </div>

                    {/* Login Card */}
                    <div className="w-full md:w-[520px]">
                        <div className="bg-white/80 backdrop-blur-xl p-10 md:p-14 rounded-xl shadow-xl border border-white/20">

                            <div className="flex flex-col gap-10">

                                <div>
                                    <h2 className="text-3xl font-bold">Log In</h2>
                                    <p className="text-gray-500">
                                        Enter your details to access the Driver Portal
                                    </p>
                                </div>

                                {/* Form */}
                                <form className="flex flex-col gap-6"
                                    onSubmit={(e) => {
                                        e.preventDefault();

                                        const normalizedEmail = email.trim().toLowerCase();

                                        // validation
                                        if (password.length < 8) {
                                            setError("Password must be at least 8 characters");
                                            return;
                                        }

                                        if (!normalizedEmail) {
                                            setError("Please enter your email");
                                            return;
                                        }

                                        // ดึง localStorage
                                        const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

                                        // รวมกับ mock
                                        const allUsers = [...mockUsers, ...storedUsers];

                                        // หา user จาก email ก่อน
                                        const foundUser = allUsers.find(
                                            (user) => user.email?.toLowerCase() === normalizedEmail
                                        );

                                        if (!foundUser) {
                                            setError("Email not found");
                                            return;
                                        }

                                        if (foundUser.password !== password) {
                                            setError("Email or password is incorrect");
                                            return;
                                        }

                                        // success
                                        setError("");
                                        localStorage.setItem("currentUser", JSON.stringify(foundUser));
                                        console.log("Login success 🚀", foundUser);
                                        navigate("/my-request");
                                    }}
                                >

                                    {/* Email */}
                                    <div>
                                        <label className="text-sm font-semibold text-gray-500 flex ">
                                            Email Address
                                        </label>

                                        <div className="relative mt-2">

                                            {/* icon */}
                                            <div className="absolute left-5 inset-y-0 flex items-center">
                                                <span className="material-symbols-outlined text-primary text-2xl leading-none">
                                                    mail
                                                </span>
                                            </div>

                                            {/* input */}
                                            <input
                                                type="email"
                                                placeholder="name@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full h-14 pl-14 pr-4 rounded-lg bg-gray-100 focus:ring-2 focus:ring-primary outline-none"
                                            />

                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <label>Password</label>

                                        </div>

                                        <div className="relative mt-2">

                                            {/* left icon */}
                                            <div className="absolute left-5 inset-y-0 flex items-center">
                                                <span className="material-symbols-outlined text-primary text-2xl">
                                                    lock
                                                </span>
                                            </div>

                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className={`w-full h-14 pl-14 pr-14 rounded-lg bg-gray-100 outline-none ${error ? "border border-red-400" : ""}`}
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
                                        {error && (
                                            <p className="text-red-500 text-sm mt-1 ml-1">
                                                {error}
                                            </p>
                                        )}
                                    </div>

                                    {/* Button */}
                                    <button
                                        type="submit"
                                        className="w-full h-16 appearance-none border-0 rounded-full text-lg !text-white font-bold cursor-pointer hover:opacity-90 active:scale-95 transition-all flex items-center justify-center"
                                        style={{ backgroundImage: "linear-gradient(90deg, #684CB5 0%, #A689F7 100%)" }}
                                    >
                                        Log In
                                    </button>
                                </form>

                                {/* Footer */}
                                <div className="text-center border-t pt-4">
                                    <p className="text-gray-500">New to our community?</p>
                                    <Link to="/signup" className="text-primary font-bold hover:underline">
                                        Apply to be a Driver →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}