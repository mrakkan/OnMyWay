import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackgroundGradientAnimation from "../components/BackgroundGradientAnimation";
import {
    APPROVED_DRIVER_MOCK_ACCOUNTS,
    loginDriverUser,
    seedApprovedDriverMockAccounts,
} from "../utils/driverAuthStorage";

export default function DriverLogin() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const approvedMockAccount = APPROVED_DRIVER_MOCK_ACCOUNTS[0];

    useEffect(() => {
        seedApprovedDriverMockAccounts();
    }, []);

    return (
        <BackgroundGradientAnimation
            gradientBackgroundStart="rgb(244, 241, 248)"
            gradientBackgroundEnd="rgb(99, 69, 212)"
            firstColor="122, 90, 248"
            secondColor="168, 85, 247"
            thirdColor="147, 51, 234"
            fourthColor="99, 102, 241"
            fifthColor="196, 181, 253"
            pointerColor="124, 58, 237"
            size="90%"
            blendingValue="hard-light"
            className="z-0"
            interactive
        >
            <div className="min-h-screen text-slate-900">
                <main>
                    <section className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 sm:py-10 md:px-10">
                        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl flex-col items-center justify-center">
                            <div className="text-center">
                                <h1 className="text-5xl font-bold tracking-tight text-white">OnMyWay Driver</h1>
                            </div>

                            <div className="mt-8 w-full max-w-md rounded-[2rem] bg-white/90 px-5 py-7 shadow-[0_16px_45px_-25px_rgba(91,51,184,0.55)] backdrop-blur sm:px-8 sm:py-9">
                                <h2 className="text-3xl font-extrabold leading-[1.12] tracking-tight text-slate-800 sm:text-4xl">
                                    Welcome back!
                                </h2>
                                <p className="mt-2 text-sm text-slate-500">Enter your details to access the driver portal.</p>

                                <form
                                    className="mt-8 space-y-6"
                                    onSubmit={(e) => {
                                        e.preventDefault();

                                        const normalizedEmail = email.trim().toLowerCase();

                                        if (password.length < 8) {
                                            setError("Password must be at least 8 characters");
                                            return;
                                        }

                                        if (!normalizedEmail) {
                                            setError("Please enter your email");
                                            return;
                                        }

                                        try {
                                            const foundUser = loginDriverUser(normalizedEmail, password);
                                            setError("");

                                            navigate(
                                                foundUser.driverApprovalStatus === "approved"
                                                    ? "/driver/dashboard"
                                                    : "/driver/my-request"
                                            );
                                        } catch (loginError) {
                                            setError(
                                                loginError instanceof Error
                                                    ? loginError.message
                                                    : "Unable to sign in"
                                            );
                                        }
                                    }}
                                >
                                    {error && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>}

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">Email Address</label>
                                        <div className="relative flex items-center gap-2 rounded-full bg-[#efeaf4] px-4 py-3 text-slate-500">
                                            <span className="material-symbols-outlined text-xl">mail</span>
                                            <input
                                                type="email"
                                                placeholder="name@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                                        <div className="relative flex items-center gap-2 rounded-full bg-[#efeaf4] px-4 py-3 text-slate-500">
                                            <span className="material-symbols-outlined text-xl">lock</span>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="inline-flex text-slate-400"
                                                aria-label="Toggle password visibility"
                                            >
                                                <span className="material-symbols-outlined text-xl">
                                                    {showPassword ? "visibility_off" : "visibility"}
                                                </span>
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 py-3.5 text-base font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 sm:text-lg"
                                    >
                                        Enter Driver Dashboard
                                        <span aria-hidden="true">→</span>
                                    </button>
                                </form>

                                <div className="mt-4 rounded-2xl border border-violet-200 bg-violet-50/70 p-4 text-sm text-violet-900">
                                    <p className="font-semibold">Mock driver (approved)</p>
                                    <p className="mt-1">Email: {approvedMockAccount.email}</p>
                                    <p>Password: {approvedMockAccount.password}</p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEmail(approvedMockAccount.email);
                                            setPassword(approvedMockAccount.password);
                                        }}
                                        className="mt-3 rounded-full bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-700"
                                    >
                                        Autofill mock account
                                    </button>
                                </div>

                                <p className="mt-9 text-center text-sm text-slate-500">
                                    New to our community?{" "}
                                    <Link to="/driver/signup" className="font-semibold text-violet-700">
                                        Apply to be a Driver
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </BackgroundGradientAnimation>
    );
}