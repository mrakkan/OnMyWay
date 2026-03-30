import { Link } from 'react-router-dom'
import drivers from '../data/drivers.json'

function DriverCard({ driver }) {
  return (
    <article className="rounded-[2rem] border border-[#e7e0ef] bg-[#ede8f3] p-5 shadow-[0_10px_24px_-18px_rgba(70,52,115,0.55)]">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br ${driver.avatarTone} text-2xl font-bold text-slate-700`}
        >
          {driver.avatarLabel}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-2xl font-black leading-tight text-slate-800 sm:text-3xl">{driver.name}</h3>
            <div className="text-right">
              <p className="text-3xl font-black leading-none text-violet-600 sm:text-4xl">${driver.price}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">per hour</p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3 text-sm text-slate-600">
            <span className="text-violet-600">★★★★★</span>
            <span className="font-semibold">{driver.rating}</span>
            <span className="font-semibold">({driver.rides} rides)</span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-600">{driver.bio}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Link
          to={`/driver/${driver.id}`}
          className="rounded-full bg-violet-600 px-6 py-3 text-lg font-bold text-white transition hover:bg-violet-700"
        >
          Select Driver
        </Link>
      </div>
    </article>
  )
}

function FindRidePage() {
  return (
    <div className="text-slate-800">
      <main className="mx-auto grid max-w-7xl gap-8 px-5 py-7 lg:grid-cols-[17rem_1fr] lg:px-8">
        <aside className="h-fit rounded-[2rem] border border-[#e6dfef] bg-[#ece7f1] p-5 shadow-[0_10px_24px_-18px_rgba(70,52,115,0.55)]">
          <h2 className="text-2xl font-black text-violet-700">Filter Options</h2>

          <div className="mt-6 space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Price Range (Per Hour)</p>
              <div className="mt-3 h-1 rounded bg-[#d9d1e4]" />
              <div className="mt-2 flex justify-between text-sm font-semibold text-slate-700">
                <span>$0</span>
                <span>$50</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Minimum Rating</p>
              <div className="mt-4 space-y-3 text-slate-700">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input type="radio" name="rating" className="h-4 w-4 accent-violet-600" />
                  <span>5 ★</span>
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input type="radio" name="rating" defaultChecked className="h-4 w-4 accent-violet-600" />
                  <span>4+ ★</span>
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input type="radio" name="rating" className="h-4 w-4 accent-violet-600" />
                  <span>3+ ★</span>
                </label>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Availability</p>
              <select className="mt-3 w-full rounded-full bg-[#e5dfeb] px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none">
                <option>Available Today</option>
                <option>Available Tomorrow</option>
                <option>This Week</option>
              </select>
            </div>
          </div>
        </aside>

        <section>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="max-w-3xl text-4xl font-black leading-[0.98] text-slate-800 sm:text-5xl lg:text-6xl lg:leading-[0.94]">
                Find a Friendly Driver
                <br />
                for Your Next
                <br />
                Appointment
              </h1>
              <p className="mt-3 text-base font-medium text-slate-600 sm:text-xl lg:text-3xl">42 verified volunteer drivers available near you</p>
            </div>

            <div className="rounded-full bg-[#e6e0ec] px-5 py-3 text-sm font-bold text-slate-600">
              <span>Sort by: </span>
              <span className="text-violet-700">Top Rated</span>
            </div>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            {drivers.map((driver) => (
              <DriverCard key={driver.name} driver={driver} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default FindRidePage
