import { Link, useParams } from 'react-router-dom'
import driverProfiles from '../data/driverProfiles.json'
import { LightWavesBackground } from '../components/LightWavesBackground'

function DriverProfilePage() {
  const { driverId } = useParams()
  const driver = driverProfiles[driverId] ?? driverProfiles['margaret-wilson']

  return (
    <div className="text-slate-800">
      <main className="mx-auto grid max-w-[1240px] gap-7 px-5 py-6 md:grid-cols-[minmax(0,1fr)_20rem] lg:px-8">
        <section className="space-y-6">
          <Link to="/find-ride" className="inline-flex items-center gap-2 text-sm font-bold text-violet-700 hover:text-violet-900">
            <span aria-hidden="true">←</span>
            Back to Drivers
          </Link>
    
          <article className="grid gap-5 rounded-[2rem] bg-[#ece7f1] p-5 md:grid-cols-[10rem_1fr] md:items-center lg:p-6">
            <div className="relative">
              <div
                className={`flex h-40 w-full items-center justify-center rounded-[1.75rem] bg-gradient-to-br ${driver.avatarTone} text-5xl font-black text-slate-700 md:h-40 md:w-40`}
              >
                {driver.avatarLabel}
              </div>
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-rose-200 px-4 py-1 text-xs font-black uppercase tracking-[0.18em] text-slate-700">
                Verified
              </span>
            </div>

            <div>
              <h1 className="text-4xl font-black leading-[0.94] text-slate-800 lg:text-6xl">{driver.name}</h1>
              <p className="mt-1 text-lg font-bold text-violet-700 lg:text-3xl">{driver.subtitle}</p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-[#e4dfea] px-4 py-3 text-center">
                  <p className="text-3xl font-black text-violet-700 lg:text-4xl">{driver.experience}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Experience</p>
                </div>
                <div className="rounded-3xl bg-[#e4dfea] px-4 py-3 text-center">
                  <p className="text-3xl font-black text-violet-700 lg:text-4xl">{driver.rating}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Rating</p>
                </div>
                <div className="rounded-3xl bg-[#e4dfea] px-4 py-3 text-center">
                  <p className="text-3xl font-black text-violet-700 lg:text-4xl">{driver.safeRides}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Safe Rides</p>
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-[2rem] bg-[#ece7f1] p-5 lg:p-6">
            <h2 className="text-3xl font-black text-slate-800 lg:text-5xl">About {driver.name.split(' ')[0]}</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-700 lg:text-lg">{driver.about}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {driver.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-[#ddd7e8] px-3 py-1 text-sm font-semibold text-slate-700">
                  {tag}
                </span>
              ))}
            </div>
          </article>

          <section>
            <h2 className="text-3xl font-black text-slate-800 lg:text-5xl">Service Area & Availability</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <article className="rounded-[2rem] bg-[#ece7f1] p-5">
                <p className="text-violet-700">📍</p>
                <h3 className="mt-2 text-2xl font-black text-slate-800 lg:text-4xl">Primary Regions</h3>
                <p className="mt-2 text-base leading-relaxed text-slate-700 lg:text-lg">{driver.regions}</p>
                <div className="mt-5 h-28 rounded-3xl bg-[linear-gradient(135deg,#c5b6a6_0%,#e6d5bf_55%,#8ac2bf_100%)]" />
              </article>

              <article className="rounded-[2rem] bg-[#ece7f1] p-5">
                <p className="text-violet-700">🗓</p>
                <h3 className="mt-2 text-2xl font-black text-slate-800 lg:text-4xl">Typical Hours</h3>
                <ul className="mt-3 space-y-2 text-base lg:text-lg">
                  {driver.hours.map(([day, time]) => (
                    <li key={day} className="flex items-center justify-between gap-4">
                      <span className="font-semibold text-slate-700">{day}</span>
                      <span className="font-bold text-violet-700">{time}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-slate-800 lg:text-5xl">Recent Reviews</h2>
              <button type="button" className="text-base font-bold text-violet-700 underline underline-offset-4">
                View All 152
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {driver.reviews.map((review) => (
                <article key={review.name} className="sun-card sun-card--interactive sun-card--review p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dccfe9] text-sm font-bold text-slate-700">
                      {review.initials}
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-800">{review.name}</p>
                      <p className="text-violet-700">★★★★★</p>
                    </div>
                  </div>
                  <p className="mt-3 text-base leading-relaxed text-slate-700">{review.text}</p>
                </article>
              ))}
            </div>
          </section>
        </section>

        <aside className="h-fit rounded-[2rem] border border-[#e2daec] bg-[#ece7f1] p-5 shadow-[0_16px_36px_-24px_rgba(70,52,115,0.65)] md:sticky md:top-5">
          <h2 className="text-3xl font-black text-violet-700">Request Ride</h2>

          <div className="mt-5 space-y-5">
        

            <Link
              to={`/driver/${driverId}/request`}
              className="block w-full rounded-full bg-violet-600 px-5 py-3 text-center text-xl font-black text-white transition hover:bg-violet-700"
            >
              Request Ride
            </Link>

            <p className="text-center text-sm text-slate-600">No payment required until ride completion.</p>

            <div className="rounded-2xl bg-[#e4dcea] p-3 text-sm text-slate-700">
              <p>
                <span className="font-black text-violet-700">✓</span> Martha has passed all Silver-Standard background checks.
              </p>
            </div>
          </div>
        </aside>
      </main>
      
    </div>
  )
}

export default DriverProfilePage
