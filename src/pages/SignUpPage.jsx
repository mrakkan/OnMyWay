import { Link } from 'react-router-dom'

function SignUpPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3eff7] text-slate-800">
      <div className="signin-blob signin-blob-left" />
      <div className="signin-blob signin-blob-right" />
      <div className="signin-blob signin-blob-mid-left" />
      <div className="signin-blob signin-blob-mid-right" />
      <div className="signin-blob signin-blob-top" />

      <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2 text-violet-700">
          <span className="text-2xl font-bold tracking-tight">OnMyWay</span>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-600">Already a member?</span>
          <Link
            to="/signin"
            className="rounded-full border border-violet-200 px-5 py-2.5 font-semibold text-violet-700 transition hover:bg-violet-50"
          >
            Sign In
          </Link>
        </div>
      </div>

      <main className="relative z-10 mx-auto grid max-w-7xl gap-10 px-8 pb-12 pt-4 lg:grid-cols-[1fr_1.2fr]">
        <section className="pt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">Welcome to the Family</p>
          <h1 className="mt-4 text-6xl font-black leading-[0.95] text-slate-800">
            Join our
            <br />
            <span className="text-violet-600">Caring</span>
            <br />
            <span className="text-violet-600">Community</span>
          </h1>
          <p className="mt-6 max-w-md text-2xl leading-relaxed text-slate-600">
            Experience a new standard of mobility designed with dignity, safety, and comfort at its heart.
          </p>


          <div className="mt-6 max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex h-44 items-center justify-center bg-slate-100 text-sm text-slate-400">
              ใส่รูปผู้สูงอายุที่นี่
            </div>
            <div className="m-3 rounded-2xl bg-white/90 p-3 text-xs text-slate-600 shadow">
              &ldquo;Amethyst Care gave me back my independence. The drivers feel like family.&rdquo;
              <p className="mt-1 font-semibold text-slate-700">— Martha S., Member since 2023</p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-[#e9e2f0] bg-[#f2edf7] p-8 shadow-[0_18px_45px_-35px_rgba(76,49,134,0.5)]">
          <form className="space-y-8">
            <div>
              <h2 className="mb-5 flex items-center gap-3 text-3xl font-black text-slate-800">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">1</span>
                Personal Identity
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Full Name</span>
                  <input className="w-full rounded-full bg-[#e5dfeb] px-5 py-3.5 text-base placeholder:text-slate-500 focus:outline-none" placeholder="e.g. Itsaree tamchareon" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Date of Birth</span>
                  <input className="w-full rounded-full bg-[#e5dfeb] px-5 py-3.5 text-base placeholder:text-slate-500 focus:outline-none" placeholder="mm/dd/yyyy" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Phone Number</span>
                  <input className="w-full rounded-full bg-[#e5dfeb] px-5 py-3.5 text-base placeholder:text-slate-500 focus:outline-none" placeholder="065-999157" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Email Address</span>
                  <input className="w-full rounded-full bg-[#e5dfeb] px-5 py-3.5 text-base placeholder:text-slate-500 focus:outline-none" placeholder="seaman@example.com" />
                </label>
              </div>
            </div>

            <div>
              <h2 className="mb-5 flex items-center gap-3 text-3xl font-black text-slate-800">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">2</span>
                Residential Details
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Street Address</span>
                  <input className="w-full rounded-full bg-[#e5dfeb] px-5 py-3.5 text-base placeholder:text-slate-500 focus:outline-none" placeholder="123 Serenity Lane" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Apartment / Suite</span>
                  <input className="w-full rounded-full bg-[#e5dfeb] px-5 py-3.5 text-base placeholder:text-slate-500 focus:outline-none" placeholder="Apt 4B (Optional)" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">City</span>
                  <input className="w-full rounded-full bg-[#e5dfeb] px-5 py-3.5 text-base placeholder:text-slate-500 focus:outline-none" placeholder="บางพลี" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">State / Province (จังหวัด)</span>
                  <select className="w-full rounded-full bg-[#e5dfeb] px-5 py-3.5 text-base text-slate-700 focus:outline-none">
                    <option>กรุงเทพมหานคร</option>
                    <option>เชียงใหม่</option>
                    <option>ขอนแก่น</option>
                    <option>ชลบุรี</option>
                    <option>ภูเก็ต</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Postal Code</span>
                  <input className="w-full rounded-full bg-[#e5dfeb] px-5 py-3.5 text-base placeholder:text-slate-500 focus:outline-none" placeholder="999157" />
                </label>
              </div>
            </div>

            <div className="rounded-3xl bg-[#e8dff3] p-5 text-sm text-slate-600">
              <label className="flex items-start gap-3">
                <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-violet-300" />
                <span>
                  I agree to the <span className="font-semibold text-violet-700">Terms of Service</span> and{' '}
                  <span className="font-semibold text-violet-700">Privacy Policy</span>. I understand that my data is protected under HIPAA-grade security standards.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-violet-500 py-4 text-2xl font-bold text-white shadow-[0_14px_30px_-20px_rgba(91,57,168,0.8)] transition hover:bg-violet-600"
            >
              Create Account →
            </button>

            <p className="text-center text-sm text-slate-600">
              Need help? <span className="font-semibold text-violet-700">Call our support center</span> at 9999
            </p>
          </form>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-200 px-8 py-6 text-sm text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <p>
            <span className="font-semibold text-slate-600">OnMyWay</span>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default SignUpPage
