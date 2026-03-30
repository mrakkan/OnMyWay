import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Accessibility,
  ArrowRight,
  Calendar,
  Clock3,
  Ear,
  MapPin,
  PersonStanding,
  PlusSquare,
  Search,
  UserRoundPlus,
  Waves,
  Waypoints,
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import driverProfiles from '../data/driverProfiles.json'
import { addPendingRide, initializePendingRideSession } from '../utils/pendingRidesStorage'

const quickDestinations = ['St. Mary\'s General Hospital', 'Northwest Dialysis Center']
const DEFAULT_MAP_CENTER = { lat: 13.7563, lng: 100.5018 }

const destinationPinIcon = L.divIcon({
  className: 'custom-destination-pin',
  html: `
    <div style="position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center;">
      <span style="position:absolute;inset:0;border-radius:9999px;background:#7c3aed;opacity:0.25;transform:scale(1.15);"></span>
      <span style="position:relative;width:16px;height:16px;border-radius:9999px;background:#7c3aed;border:2px solid #ffffff;box-shadow:0 8px 18px rgba(30,41,59,0.28);"></span>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

const pickupPinIcon = L.divIcon({
  className: 'custom-pickup-pin',
  html: `
    <div style="position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center;">
      <span style="position:absolute;inset:0;border-radius:9999px;background:#0f766e;opacity:0.22;transform:scale(1.15);"></span>
      <span style="position:relative;width:16px;height:16px;border-radius:9999px;background:#0f766e;border:2px solid #ffffff;box-shadow:0 8px 18px rgba(30,41,59,0.28);"></span>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

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

async function searchDestinationSuggestions(query, { signal, limit = 6 } = {}) {
  const searchParams = new URLSearchParams({
    format: 'jsonv2',
    q: query,
    limit: String(limit),
    addressdetails: '1',
  })

  const response = await fetch(`https://nominatim.openstreetmap.org/search?${searchParams.toString()}`, { signal })
  if (!response.ok) {
    throw new Error('destination-search-failed')
  }

  const payload = await response.json()
  return payload
    .map((item) => ({
      label: item.display_name,
      lat: Number(item.lat),
      lng: Number(item.lon),
    }))
    .filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng))
}

async function reverseDestinationLookup(lat, lng, { signal } = {}) {
  const searchParams = new URLSearchParams({
    format: 'jsonv2',
    lat: String(lat),
    lon: String(lng),
  })

  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${searchParams.toString()}`, { signal })
  if (!response.ok) {
    throw new Error('destination-reverse-failed')
  }

  const payload = await response.json()
  return payload.display_name || ''
}

function RecenterMap({ center }) {
  const map = useMap()

  useEffect(() => {
    map.flyTo(center, 14, { duration: 0.65 })
  }, [center, map])

  return null
}

function LocationMapPin({ markerPosition, onMapPick, markerIcon }) {
  useMapEvents({
    click(event) {
      onMapPick(event.latlng.lat, event.latlng.lng)
    },
  })

  if (!markerPosition) {
    return null
  }

  return <Marker position={[markerPosition.lat, markerPosition.lng]} icon={markerIcon} />
}

export default function RequestRidePage() {
  const { driverId } = useParams()
  const navigate = useNavigate()
  const driver = driverProfiles[driverId] ?? driverProfiles['margaret-wilson']

  const driverAvatarUrl = useMemo(() => {
    return `https://i.pravatar.cc/160?u=${driverId || 'margaret-wilson'}`
  }, [driverId])

  const [formValues, setFormValues] = useState({
    pickupLocation: '',
    destination: '',
    rideDate: '',
    pickupTime: '',
    notes: '',
  })
  const [selectedAssistances, setSelectedAssistances] = useState(['walking-aid'])
  const [pickupSuggestions, setPickupSuggestions] = useState([])
  const [isPickupLoading, setIsPickupLoading] = useState(false)
  const [pickupSearchError, setPickupSearchError] = useState('')
  const [isResolvingPickupMapPick, setIsResolvingPickupMapPick] = useState(false)
  const [selectedPickupLocation, setSelectedPickupLocation] = useState(null)
  const [destinationSuggestions, setDestinationSuggestions] = useState([])
  const [isDestinationLoading, setIsDestinationLoading] = useState(false)
  const [destinationSearchError, setDestinationSearchError] = useState('')
  const [isResolvingMapPick, setIsResolvingMapPick] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)

  const skipNextPickupSuggestionRequestRef = useRef(false)
  const pickupReverseLookupRequestIdRef = useRef(0)
  const skipNextSuggestionRequestRef = useRef(false)
  const reverseLookupRequestIdRef = useRef(0)

  const pickupMapCenter = selectedPickupLocation
    ? [selectedPickupLocation.lat, selectedPickupLocation.lng]
    : [DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng]
  const destinationMapCenter = selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : [DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng]

  useEffect(() => {
    const query = formValues.pickupLocation.trim()

    if (skipNextPickupSuggestionRequestRef.current) {
      skipNextPickupSuggestionRequestRef.current = false
      return undefined
    }

    if (query.length < 3) {
      setPickupSuggestions([])
      setPickupSearchError('')
      return undefined
    }

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setIsPickupLoading(true)
      setPickupSearchError('')

      try {
        const nextSuggestions = await searchDestinationSuggestions(query, {
          signal: controller.signal,
        })

        setPickupSuggestions(nextSuggestions)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setPickupSuggestions([])
          setPickupSearchError('Unable to search pickup location right now. Please try again.')
        }
      } finally {
        setIsPickupLoading(false)
      }
    }, 320)

    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [formValues.pickupLocation])

  useEffect(() => {
    const query = formValues.destination.trim()

    if (skipNextSuggestionRequestRef.current) {
      skipNextSuggestionRequestRef.current = false
      return undefined
    }

    if (query.length < 3) {
      setDestinationSuggestions([])
      setDestinationSearchError('')
      return undefined
    }

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setIsDestinationLoading(true)
      setDestinationSearchError('')

      try {
        const nextSuggestions = await searchDestinationSuggestions(query, {
          signal: controller.signal,
        })

        setDestinationSuggestions(nextSuggestions)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setDestinationSuggestions([])
          setDestinationSearchError('Unable to search destination right now. Please try again.')
        }
      } finally {
        setIsDestinationLoading(false)
      }
    }, 320)

    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [formValues.destination])

  const onChangeField = (field) => (event) => {
    const { value } = event.target
    setFormValues((current) => ({ ...current, [field]: value }))
  }

  const selectPickupSuggestion = (suggestion) => {
    skipNextPickupSuggestionRequestRef.current = true
    setFormValues((current) => ({ ...current, pickupLocation: suggestion.label }))
    setSelectedPickupLocation(suggestion)
    setPickupSuggestions([])
    setPickupSearchError('')
  }

  const setPickupFromMap = async (lat, lng) => {
    const normalizedLat = Number(lat.toFixed(6))
    const normalizedLng = Number(lng.toFixed(6))
    const fallbackLabel = `Pinned pickup (${normalizedLat}, ${normalizedLng})`

    pickupReverseLookupRequestIdRef.current += 1
    const requestId = pickupReverseLookupRequestIdRef.current

    skipNextPickupSuggestionRequestRef.current = true
    setSelectedPickupLocation({ lat: normalizedLat, lng: normalizedLng, label: fallbackLabel })
    setFormValues((current) => ({ ...current, pickupLocation: fallbackLabel }))
    setPickupSuggestions([])
    setPickupSearchError('')
    setIsResolvingPickupMapPick(true)

    try {
      const resolvedLabel = await reverseDestinationLookup(normalizedLat, normalizedLng)
      if (pickupReverseLookupRequestIdRef.current !== requestId) {
        return
      }

      if (!resolvedLabel) {
        return
      }

      skipNextPickupSuggestionRequestRef.current = true
      setSelectedPickupLocation({ lat: normalizedLat, lng: normalizedLng, label: resolvedLabel })
      setFormValues((current) => ({ ...current, pickupLocation: resolvedLabel }))
    } catch {
      // Keep fallback label when reverse geocoding fails.
    } finally {
      if (pickupReverseLookupRequestIdRef.current === requestId) {
        setIsResolvingPickupMapPick(false)
      }
    }
  }

  const selectDestinationSuggestion = (suggestion) => {
    skipNextSuggestionRequestRef.current = true
    setFormValues((current) => ({ ...current, destination: suggestion.label }))
    setSelectedLocation(suggestion)
    setDestinationSuggestions([])
    setDestinationSearchError('')
  }

  const setDestinationFromMap = async (lat, lng) => {
    const normalizedLat = Number(lat.toFixed(6))
    const normalizedLng = Number(lng.toFixed(6))
    const fallbackLabel = `Pinned location (${normalizedLat}, ${normalizedLng})`

    reverseLookupRequestIdRef.current += 1
    const requestId = reverseLookupRequestIdRef.current

    skipNextSuggestionRequestRef.current = true
    setSelectedLocation({ lat: normalizedLat, lng: normalizedLng, label: fallbackLabel })
    setFormValues((current) => ({ ...current, destination: fallbackLabel }))
    setDestinationSuggestions([])
    setDestinationSearchError('')
    setIsResolvingMapPick(true)

    try {
      const resolvedLabel = await reverseDestinationLookup(normalizedLat, normalizedLng)
      if (reverseLookupRequestIdRef.current !== requestId) {
        return
      }

      if (!resolvedLabel) {
        return
      }

      skipNextSuggestionRequestRef.current = true
      setSelectedLocation({ lat: normalizedLat, lng: normalizedLng, label: resolvedLabel })
      setFormValues((current) => ({ ...current, destination: resolvedLabel }))
    } catch {
      // Keep fallback label when reverse geocoding fails.
    } finally {
      if (reverseLookupRequestIdRef.current === requestId) {
        setIsResolvingMapPick(false)
      }
    }
  }

  const applyQuickDestination = async (destination) => {
    setFormValues((current) => ({ ...current, destination }))
    setDestinationSuggestions([])
    setDestinationSearchError('')

    try {
      const [firstSuggestion] = await searchDestinationSuggestions(destination, { limit: 1 })
      if (firstSuggestion) {
        skipNextSuggestionRequestRef.current = true
        setFormValues((current) => ({ ...current, destination: firstSuggestion.label }))
        setSelectedLocation(firstSuggestion)
      }
    } catch {
      // Keep destination text even if geocoding fails.
    }
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
      pickup: formValues.pickupLocation || 'Pickup to be confirmed',
      pickupLat: selectedPickupLocation?.lat ?? null,
      pickupLng: selectedPickupLocation?.lng ?? null,
      destinationLat: selectedLocation?.lat ?? null,
      destinationLng: selectedLocation?.lng ?? null,
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

              <div>
                <p className="mb-2 text-sm font-black text-slate-700">Where should your driver pick you up?</p>
                <div className="relative">
                  <input
                    value={formValues.pickupLocation}
                    onChange={onChangeField('pickupLocation')}
                    required
                    type="text"
                    placeholder="Search pickup point (home, clinic lobby, etc.)"
                    className="w-full rounded-full border border-transparent bg-white px-5 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-600"
                  />
                  <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-teal-700" />
                </div>

                {(isPickupLoading || pickupSuggestions.length > 0 || pickupSearchError) && (
                  <div className="mt-2 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-teal-100">
                    {isPickupLoading && <p className="px-3 py-2 text-xs font-semibold text-slate-500">Searching pickup locations...</p>}
                    {!isPickupLoading && pickupSuggestions.length > 0 && (
                      <ul className="max-h-56 overflow-auto">
                        {pickupSuggestions.map((suggestion) => (
                          <li key={`pickup-${suggestion.lat}-${suggestion.lng}`}>
                            <button
                              type="button"
                              onClick={() => selectPickupSuggestion(suggestion)}
                              className="w-full rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-700 transition hover:bg-teal-50"
                            >
                              {suggestion.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    {!isPickupLoading && pickupSearchError && <p className="px-3 py-2 text-xs font-semibold text-rose-600">{pickupSearchError}</p>}
                  </div>
                )}

                <div className="mt-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
                    <MapPin className="h-4 w-4 text-teal-700" />
                    Pin pickup point on map
                  </div>

                  <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-teal-200">
                    <div className="h-64 w-full">
                      <MapContainer center={pickupMapCenter} zoom={13} className="h-full w-full" scrollWheelZoom>
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <RecenterMap center={pickupMapCenter} />
                        <LocationMapPin
                          markerPosition={selectedPickupLocation}
                          onMapPick={setPickupFromMap}
                          markerIcon={pickupPinIcon}
                        />
                      </MapContainer>
                    </div>
                  </div>

                  <p className="mt-2 text-xs font-semibold text-slate-500">Click on map to place pickup pin where the driver should arrive.</p>
                  {isResolvingPickupMapPick && <p className="mt-1 text-xs font-semibold text-teal-700">Resolving pickup location...</p>}
                </div>
              </div>

              <div className="mt-5 border-t border-[#d2c6df] pt-5">
                <p className="mb-2 text-sm font-black text-slate-700">Where are you going?</p>
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

              {(isDestinationLoading || destinationSuggestions.length > 0 || destinationSearchError) && (
                <div className="mt-2 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-violet-100">
                  {isDestinationLoading && <p className="px-3 py-2 text-xs font-semibold text-slate-500">Searching destinations...</p>}
                  {!isDestinationLoading && destinationSuggestions.length > 0 && (
                    <ul className="max-h-56 overflow-auto">
                      {destinationSuggestions.map((suggestion) => (
                        <li key={`${suggestion.lat}-${suggestion.lng}`}>
                          <button
                            type="button"
                            onClick={() => selectDestinationSuggestion(suggestion)}
                            className="w-full rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-700 transition hover:bg-violet-50"
                          >
                            {suggestion.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {!isDestinationLoading && destinationSearchError && (
                    <p className="px-3 py-2 text-xs font-semibold text-rose-600">{destinationSearchError}</p>
                  )}
                </div>
              )}

              <div className="mt-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
                  <MapPin className="h-4 w-4 text-violet-700" />
                  Pin destination on map
                </div>

                <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-violet-200">
                  <div className="h-72 w-full">
                    <MapContainer center={destinationMapCenter} zoom={13} className="h-full w-full" scrollWheelZoom>
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      <RecenterMap center={destinationMapCenter} />
                      <LocationMapPin
                        markerPosition={selectedLocation}
                        onMapPick={setDestinationFromMap}
                        markerIcon={destinationPinIcon}
                      />
                    </MapContainer>
                  </div>
                </div>

                <p className="mt-2 text-xs font-semibold text-slate-500">Click anywhere on the map to pin a location, then adjust by searching if needed.</p>
                {isResolvingMapPick && <p className="mt-1 text-xs font-semibold text-violet-700">Resolving pinned location...</p>}
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {quickDestinations.map((destination) => (
                  <button
                    key={destination}
                    type="button"
                    onClick={() => applyQuickDestination(destination)}
                    className="rounded-2xl bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 ring-1 ring-transparent transition hover:ring-violet-300"
                  >
                    {destination}
                  </button>
                ))}
              </div>
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
