import { Link } from 'react-router-dom'

function SignInPage() {
  return (
    <div className="min-h-screen bg-[#f4f1f8] text-slate-900">
      <main>
        <section className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 sm:py-10 md:px-10">
          <div className="signin-blob signin-blob-left" />
          <div className="signin-blob signin-blob-right" />
          <div className="signin-blob signin-blob-mid-left" />
          <div className="signin-blob signin-blob-mid-right" />
          <div className="signin-blob signin-blob-top" />

          <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl flex-col items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-violet-700">OnMyWay</h1>
            
            </div>

            <div className="mt-8 w-full max-w-md rounded-[2rem] bg-white/90 px-5 py-7 shadow-[0_16px_45px_-25px_rgba(91,51,184,0.55)] backdrop-blur sm:px-8 sm:py-9">
              <h2 className="text-3xl font-extrabold leading-[1.12] tracking-tight text-slate-800 sm:text-4xl">
                Welcome back!
              </h2>

              <form className="mt-8 space-y-6">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2 rounded-full bg-[#efeaf4] px-4 py-3 text-slate-500">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M3 7l9 6 9-6" />
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                    </svg>
                    <input
                      id="email"
                      type="email"
                      placeholder="yourname@email.com"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                      Password
                    </label>
                    <button type="button" className="text-sm font-medium text-violet-600">
                        Forgot Password?
                    </button>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-[#efeaf4] px-4 py-3 text-slate-500">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="5" y="11" width="14" height="10" rx="2" />
                      <path d="M8 11V8a4 4 0 118 0v3" />
                    </svg>
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                    />
                    <button type="button" aria-label="Toggle password visibility" className="text-slate-400">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
                        <circle cx="12" cy="12" r="2.5" />
                      </svg>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 py-3.5 text-base font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 sm:text-lg"
                >
                  Enter Your Dashboard
                  <span aria-hidden="true">→</span>
                </button>
              </form>

              <p className="mt-9 text-center text-sm text-slate-500">
                New to OnMyWay Care?{' '}
                <Link to="/signup" className="font-semibold text-violet-700">
                  Create an account
                </Link>
              </p>
            </div>

            <div className="mt-6 flex w-full max-w-md items-center justify-between px-1 text-[10px] uppercase tracking-widest text-slate-400 sm:text-[11px]">
              <span>24/7 Support</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default SignInPage
