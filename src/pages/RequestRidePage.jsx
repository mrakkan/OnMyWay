import { useMemo, useState } from 'react'
import {
  Accessibility,
  ArrowRight,
  Calendar,
  Clock3,
  Ear,
  PersonStanding,
  PlusSquare,
  Search,
  UserRoundPlus,
  Waves,
  Waypoints,
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import driverProfiles from '../data/driverProfiles.json'
import { addPendingRide, initializePendingRideSession } from '../utils/pendingRidesStorage'

const quickDestinations = ['St. Mary\'s General Hospital', 'Northwest Dialysis Center']

const assistanceOptions = [
  { id: 'wheelchair', label: 'Wheelchair', icon: Accessibility },
  { id: 'walking-aid', label: 'Walking Aid', icon: PersonStanding },
  { id: 'hearing-aid', label: 'Hearing Aid', icon: Ear },
  { id: 'companion', label: 'Companion', icon: UserRoundPlus },
]

function getRequestDateLabel(dateValue, timeValue) {
  const fallbackDate = new Date()
  const date = dateValue ? new Date(`${dateValue}T${timeValue || '09:00'}`) : fallbackDate

  const dateLabel = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  const timeLabel = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  return `${dateLabel.toUpperCase()}, ${timeLabel}`
}

export default function RequestRidePage() {
  const { driverId } = useParams()
  const navigate = useNavigate()
  const driver = driverProfiles[driverId] ?? driverProfiles['margaret-wilson']

  const driverAvatarUrl = useMemo(() => {
    return `https://i.pravatar.cc/160?u=${driverId || 'margaret-wilson'}`
  }, [driverId])

  const [formValues, setFormValues] = useState({
    destination: '',
    rideDate: '',
    pickupTime: '',
    notes: '',
  })
  const [selectedAssistances, setSelectedAssistances] = useState(['walking-aid'])

  const onChangeField = (field) => (event) => {
    const { value } = event.target
    setFormValues((current) => ({ ...current, [field]: value }))
  }

  const toggleAssistance = (assistanceId) => {
    setSelectedAssistances((current) => {
      if (current.includes(assistanceId)) {
        return current.filter((item) => item !== assistanceId)
      }

      return [...current, assistanceId]
    })
  }

  const onSubmit = (event) => {
    event.preventDefault()
    initializePendingRideSession()

    const pendingRide = {
      id: `pending-${Date.now()}`,
      driverId: driverId || 'margaret-wilson',
      date: getRequestDateLabel(formValues.rideDate, formValues.pickupTime),
      status: 'Pending',
      title: formValues.destination || 'Medical Appointment',
      location: formValues.destination || 'Destination to be confirmed',
      borderStyle: 'yellow',
      fromLocalPending: true,
      driverName: driver.name,
      driverAvatar: driverAvatarUrl,
      requestedAt: Date.now(),
      notes: formValues.notes,
    }

    addPendingRide(pendingRide)
    navigate('/schedule')
  }

  return (
    <div className="min-h-screen bg-[#f3eff7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-6">
          <Link to={`/driver/${driverId}`} className="inline-flex items-center gap-2 text-sm font-bold text-violet-700 hover:text-violet-900">
            <span aria-hidden="true">←</span>
            Back to Driver Profile
          </Link>
        </div>

        <main className="mx-auto max-w-[760px] rounded-[2.25rem] bg-[#ece7f1] p-6 sm:p-8">
          <div className="mb-7 text-center">
            <h1 className="text-4xl font-black text-slate-800 sm:text-5xl">Request a New Ride</h1>
            <p className="mx-auto mt-3 max-w-[34rem] text-base font-medium text-slate-500">
              Let&apos;s get you to your appointment safely. Fill in the details below and our concierge team will handle the rest.
            </p>
          </div>

          <div className="mb-8 flex flex-col items-center justify-center text-center">
            <img src={driverAvatarUrl} alt={driver.name} className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-lg" />
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Driver Assigned</p>
            <h2 className="text-3xl font-black text-violet-700">{driver.name}</h2>
            <p className="text-sm font-semibold text-slate-600">{driver.subtitle}</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <section className="rounded-3xl bg-[#e6e0ec] p-5 sm:p-6">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-black uppercase tracking-wide text-slate-700">
                <PlusSquare className="h-5 w-5 text-violet-700" />
                Where Are We Going?
              </h3>

              <div className="relative">
                <input
                  value={formValues.destination}
                  onChange={onChangeField('destination')}
                  required
                  type="text"
                  placeholder="Search for hospital or clinic name"
                  className="w-full rounded-full border border-transparent bg-white px-5 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-violet-500"
                />
                <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-violet-600" />
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {quickDestinations.map((destination) => (
                  <button
                    key={destination}
                    type="button"
                    onClick={() => setFormValues((current) => ({ ...current, destination }))}
                    className="rounded-2xl bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 ring-1 ring-transparent transition hover:ring-violet-300"
                  >
                    {destination}
                  </button>
                ))}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <label>
                  <span className="mb-2 flex items-center gap-2 text-base font-black text-slate-700">
                    <Calendar className="h-4 w-4 text-violet-700" />
                    Which day?
                  </span>
                  <input
                    value={formValues.rideDate}
                    onChange={onChangeField('rideDate')}
                    required
                    type="date"
                    className="w-full rounded-full border border-transparent bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-violet-500"
                  />
                </label>

                <label>
                  <span className="mb-2 flex items-center gap-2 text-base font-black text-slate-700">
                    <Clock3 className="h-4 w-4 text-violet-700" />
                    Pickup time?
                  </span>
                  <input
                    value={formValues.pickupTime}
                    onChange={onChangeField('pickupTime')}
                    type="time"
                    className="w-full rounded-full border border-transparent bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-violet-500"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-3xl bg-[#e6e0ec] p-5 sm:p-6">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-black text-slate-700">
                <Waves className="h-5 w-5 text-violet-700" />
                Special Assistance
              </h3>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {assistanceOptions.map((option) => {
                  const Icon = option.icon
                  const isSelected = selectedAssistances.includes(option.id)

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => toggleAssistance(option.id)}
                      className={`rounded-3xl px-3 py-4 text-center text-sm font-bold transition ${
                        isSelected
                          ? 'bg-violet-100 text-violet-700 ring-2 ring-violet-500'
                          : 'bg-white text-slate-700 hover:ring-2 hover:ring-violet-300'
                      }`}
                    >
                      <Icon className="mx-auto mb-2 h-5 w-5" />
                      {option.label}
                    </button>
                  )
                })}
              </div>

              <label className="mt-4 block">
                <span className="mb-2 flex items-center gap-2 text-base font-black text-slate-700">
                  <Waypoints className="h-4 w-4 text-violet-700" />
                  Notes for driver
                </span>
                <textarea
                  value={formValues.notes}
                  onChange={onChangeField('notes')}
                  rows={3}
                  placeholder="Any other notes for the driver? (e.g. gate codes, help with door)"
                  className="w-full resize-none rounded-3xl border border-transparent bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-violet-500"
                />
              </label>
            </section>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-4 text-xl font-black text-white transition hover:bg-violet-700"
            >
              Submit Request
              <ArrowRight className="h-5 w-5" />
            </button>

            <p className="text-center text-sm font-semibold text-slate-600">
              Need help? Call our concierge at <span className="text-violet-700">1-800-ELDER-CARE</span>
            </p>
          </form>
        </main>
      </div>
    </div>
  )
}
