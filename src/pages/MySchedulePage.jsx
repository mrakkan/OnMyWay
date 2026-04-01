import { useEffect, useMemo, useState } from "react"
import { MapPin, Flag, Calendar as CalendarIcon, Check, X, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import scheduleData from "../data/schedule.json"
import { getPendingRides, initializePendingRideSession } from "../utils/pendingRidesStorage"

const DEFAULT_VISIBLE_UPCOMING = 4
const DEFAULT_VISIBLE_HISTORY = 4

export default function MySchedulePage() {
  const { currentStatus, upcomingTravels, monthlySummary, recentHistory } = scheduleData
  const [localPendingRides, setLocalPendingRides] = useState([])
  const [showAllUpcoming, setShowAllUpcoming] = useState(false)
  const [showAllHistory, setShowAllHistory] = useState(false)

  useEffect(() => {
    initializePendingRideSession()
    setLocalPendingRides(getPendingRides())
  }, [])

  const mergedUpcomingTravels = useMemo(() => {
    return [...localPendingRides, ...upcomingTravels]
  }, [localPendingRides, upcomingTravels])

  const canExpandUpcoming = mergedUpcomingTravels.length > DEFAULT_VISIBLE_UPCOMING
  const visibleUpcomingTravels = useMemo(() => {
    if (showAllUpcoming) {
      return mergedUpcomingTravels
    }

    return mergedUpcomingTravels.slice(0, DEFAULT_VISIBLE_UPCOMING)
  }, [mergedUpcomingTravels, showAllUpcoming])

  const canExpandHistory = recentHistory.length > DEFAULT_VISIBLE_HISTORY
  const visibleRecentHistory = useMemo(() => {
    if (showAllHistory) {
      return recentHistory
    }

    return recentHistory.slice(0, DEFAULT_VISIBLE_HISTORY)
  }, [recentHistory, showAllHistory])

  const primaryChatDriverId = localPendingRides[0]?.driverId || 'margaret-wilson'

  return (
    <div className="min-h-screen pb-20 pt-8">
      <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ">
          <div>
            <h1 className="mb-1 text-3xl font-black text-slate-800 md:text-5xl">My Requests</h1>
            <p className="text-base font-medium text-slate-500 md:text-lg">Manage your active travels and upcoming appointments.</p>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid gap-8 lg:grid-cols-3 ">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Current Status Section */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800">
                <CalendarIcon className="h-6 w-6 text-violet-600" />
                Current Status
              </h2>
              
              <div className="rounded-3xl bg-violet-100 p-6 shadow-sm sm:p-8 relative overflow-hidden">
                {/* Decorative blob */}
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/40 blur-3xl"></div>
                
                <div className="relative z-10">
                  <div className="mb-6 flex items-center gap-4">
                    <span className="flex items-center gap-1.5 rounded-full bg-violet-300 px-3 py-1 text-xs font-semibold text-violet-800">
                      <span className="h-2 w-2 rounded-full bg-violet-600"></span>
                      {currentStatus.status}
                    </span>
                    <span className="text-sm font-medium text-slate-600">Req {currentStatus.reqId}</span>
                  </div>

                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    {/* Location Timeline */}
                    <div className="relative pl-6 space-y-6">
                      <div className="absolute left-1 top-2 bottom-2 w-0.5 bg-slate-300"></div>
                      
                      <div className="relative">
                        <div className="absolute -left-7 top-1 h-3 w-3 rounded-full border-2 border-slate-500 bg-white"></div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Pick Up</p>
                        <p className="text-base font-bold text-slate-800">{currentStatus.pickup}</p>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute -left-[30px] top-1 rounded bg-white p-0.5">
                          <Flag className="h-3 w-3 text-slate-500" />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Destination</p>
                        <p className="text-base font-bold text-slate-800">{currentStatus.destination}</p>
                      </div>
                    </div>

                    {/* Driver Card & Actions */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                      <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
                        <img src={currentStatus.driver.avatar} alt="Driver" className="h-12 w-12 rounded-full object-cover" />
                        <div>
                          <p className="text-xs font-medium text-slate-500">Your Driver</p>
                          <p className="text-base font-bold text-slate-800">{currentStatus.driver.name}</p>
                          <div className="flex text-violet-600">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <svg key={s} className="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3">
                        <Link to="/track-driver" className="rounded-full bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-violet-700 text-center">
                          Track Live
                        </Link>
                        <Link
                          to={`/chat/${primaryChatDriverId}`}
                          className="rounded-full bg-slate-200/50 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 text-center"
                        >
                          Chat with Driver
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Upcoming Travels Section */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
                  <CalendarIcon className="h-6 w-6 text-violet-600" />
                  Upcoming Travels
                </h2>
                {canExpandUpcoming ? (
                  <button
                    type="button"
                    onClick={() => setShowAllUpcoming((current) => !current)}
                    className="text-sm font-bold text-violet-600 hover:text-violet-800"
                  >
                    {showAllUpcoming ? "Show Less" : "View All"}
                  </button>
                ) : (
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-400">All visible</span>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 sm:[grid-auto-rows:1fr]">
                {visibleUpcomingTravels.map((travel) => {
                  const statusLabel = String(travel.status || '').toLowerCase()
                  const toneClass = statusLabel === 'pending' ? 'sun-card--pending' : 'sun-card--accepted'
                  const isPending = statusLabel === 'pending'
                  const travelDriverId = travel.driverId || localPendingRides.find((ride) => ride.id === travel.id)?.driverId || primaryChatDriverId
                  const actionHref = isPending ? `/driver/${travelDriverId}/request` : `/driver/${travelDriverId}`

                  return (
                  <div
                    key={travel.id}
                    className={`sun-card sun-card--interactive ${toneClass} h-full flex flex-col justify-between p-6`}
                  >
                    <div className="flex-1">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{travel.date}</span>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${travel.status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-violet-200 text-violet-800"}`}>
                          {travel.status}
                        </span>
                      </div>
                      <h3 className="mb-1 text-xl font-bold text-slate-800">{travel.title}</h3>
                      <p className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                        <MapPin className="h-4 w-4" /> {travel.location}
                      </p>
                      {travel.driverName && (
                        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-violet-700">Driver: {travel.driverName}</p>
                      )}
                    </div>
                    <Link
                      to={actionHref}
                      className="mt-6 w-full rounded-2xl border-2 border-slate-100 py-2.5 text-center text-sm font-bold text-slate-700 hover:bg-slate-50"
                    >
                      {isPending ? "Edit Details" : "View Driver"}
                    </Link>
                  </div>
                  )
                })}
              </div>
            </section>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-6">
            
            {/* Monthly Summary */}
            <div className="rounded-3xl bg-[#EBE7EFA0] p-6 lg:p-8">
              <h2 className="mb-6 text-lg font-bold text-slate-800">Monthly Summary</h2>
              <div className="mb-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
                  <p className="text-4xl font-black text-violet-700">{monthlySummary.ridesCompleted}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Rides Completed</p>
                </div>
                <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
                  <p className="text-4xl font-black text-violet-700">{monthlySummary.lateArrivals}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Late Arrivals</p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                <span className="text-sm font-semibold text-slate-500">Account Standing</span>
                <span className="flex items-center gap-1 text-sm font-bold text-emerald-600">
                  <Check className="h-4 w-4" /> {monthlySummary.standing}
                </span>
              </div>
            </div>

            {/* Recent History */}
            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                  <CalendarIcon className="h-5 w-5 text-slate-500" />
                  Recent History
                </h2>
                {canExpandHistory ? (
                  <button
                    type="button"
                    onClick={() => setShowAllHistory((current) => !current)}
                    className="text-xs font-bold uppercase tracking-wide text-violet-700 hover:text-violet-900"
                  >
                    {showAllHistory ? "Show Less" : "View All"}
                  </button>
                ) : null}
              </div>
              <div className="space-y-4">
                {visibleRecentHistory.map((history) => (
                  <div key={history.id} className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${history.type === "success" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
                      {history.type === "success" ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800">{history.title}</p>
                      <p className="text-xs font-medium text-slate-500">{history.status}</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">{history.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo Box */}
            <div className="rounded-3xl bg-violet-100 p-6 md:p-8">
              <h3 className="mb-2 text-lg font-bold text-violet-800">Need assistance with a ride?</h3>
              <p className="mb-6 text-sm font-medium text-violet-900/70">
                Our specialized care team is available 24/7 to help you coordinate.
              </p>
              <button className="flex items-center gap-2 text-sm font-bold text-violet-700 hover:text-violet-900">
                Contact Concierge <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>
          
        </div>
      </div>
    </div>
  )
}