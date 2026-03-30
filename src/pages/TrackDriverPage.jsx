import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ChevronDown, ChevronUp, MapPin, MessageCircle, Route as RouteIcon, Timer } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, Marker, Polyline, TileLayer, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getPendingRides } from '../utils/pendingRidesStorage'

const MOCK_ROUTE = [
  [13.7562, 100.5467],
  [13.7558, 100.5438],
  [13.7546, 100.5411],
  [13.7531, 100.5384],
  [13.7515, 100.5357],
  [13.7504, 100.5336],
  [13.7493, 100.5317],
  [13.7488, 100.5304],
]

const DRIVER_NAME = 'David Cooper'
const VEHICLE = 'Honda Civic • 5กข-998'
const DRIVER_SPEED_KMH = 28
const DRIVER_AVATAR = 'https://i.pravatar.cc/200?img=11'

function kmBetweenPoints(a, b) {
  const toRad = (degree) => (degree * Math.PI) / 180
  const earthRadiusKm = 6371

  const [lat1, lon1] = a
  const [lat2, lon2] = b

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const aa =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa))
  return earthRadiusKm * c
}

function routeDistanceKm(points) {
  let total = 0

  for (let i = 0; i < points.length - 1; i += 1) {
    total += kmBetweenPoints(points[i], points[i + 1])
  }

  return total
}

const driverIcon = L.divIcon({
  className: 'custom-driver-pin',
  html: `
    <div style="position:relative;width:38px;height:38px;display:flex;align-items:center;justify-content:center;">
      <span style="position:absolute;inset:0;border-radius:9999px;background:#7c3aed;opacity:0.25;transform:scale(1.1);"></span>
      <img src="${DRIVER_AVATAR}" alt="Driver" style="position:relative;width:30px;height:30px;border-radius:9999px;border:2px solid #7c3aed;object-fit:cover;box-shadow:0 6px 15px rgba(2,6,23,.28);" />
    </div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
})

const userIcon = L.divIcon({
  className: 'custom-user-pin',
  html: `
    <div style="position:relative;width:18px;height:18px;">
      <span style="position:absolute;inset:0;border-radius:9999px;background:#0f172a;box-shadow:0 0 0 5px rgba(15,23,42,0.2);"></span>
    </div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

export default function TrackDriverPage() {
  const navigate = useNavigate()
  const [driverIndex, setDriverIndex] = useState(0)
  const [isStatusExpanded, setIsStatusExpanded] = useState(false)

  const destination = MOCK_ROUTE[MOCK_ROUTE.length - 1]
  const driverPosition = MOCK_ROUTE[driverIndex]
  const latestRequestedRide = useMemo(() => {
    const pendingRides = getPendingRides()
    return pendingRides[0]
  }, [])
  const activeChatDriverId = latestRequestedRide?.driverId || 'margaret-wilson'

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDriverIndex((current) => {
        if (current >= MOCK_ROUTE.length - 1) {
          return current
        }

        return current + 1
      })
    }, 3500)

    return () => window.clearInterval(timer)
  }, [])

  const remainingRoute = useMemo(() => {
    return MOCK_ROUTE.slice(driverIndex)
  }, [driverIndex])

  const traveledRoute = useMemo(() => {
    return MOCK_ROUTE.slice(0, driverIndex + 1)
  }, [driverIndex])

  const remainingDistanceKm = useMemo(() => {
    return routeDistanceKm(remainingRoute)
  }, [remainingRoute])

  const totalDistanceKm = useMemo(() => {
    return routeDistanceKm(MOCK_ROUTE)
  }, [])

  const progressPercent = Math.round(((totalDistanceKm - remainingDistanceKm) / totalDistanceKm) * 100)
  const etaMin = Math.max(1, Math.round((remainingDistanceKm / DRIVER_SPEED_KMH) * 60))

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-slate-100">
      <MapContainer center={destination} zoom={14} className="h-full w-full" zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Polyline positions={MOCK_ROUTE} pathOptions={{ color: '#d1c4e9', weight: 8 }} />
        <Polyline positions={traveledRoute} pathOptions={{ color: '#7c3aed', weight: 8 }} />

        <Marker position={driverPosition} icon={driverIcon}>
          <Tooltip direction="top" offset={[0, -14]} opacity={1}>
            Driver now
          </Tooltip>
        </Marker>

        <Marker position={destination} icon={userIcon}>
          <Tooltip direction="top" offset={[0, -12]} opacity={1}>
            Pickup point
          </Tooltip>
        </Marker>
      </MapContainer>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[400] bg-gradient-to-b from-black/35 to-transparent p-4 sm:p-6">
        <div className="mx-auto flex w-full max-w-[980px] items-start justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-800 shadow-lg transition hover:bg-slate-100"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="pointer-events-auto rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Live Tracking</p>
            <p className="text-lg font-black text-violet-700">ถึงในประมาณ {etaMin} นาที</p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[400] p-4 sm:p-6">
        <div className="mx-auto w-full max-w-[980px]">
          <div
            className="pointer-events-auto relative rounded-3xl bg-white/95 p-5 shadow-2xl ring-1 ring-slate-200 backdrop-blur transition-transform duration-300 ease-out sm:p-6"
            style={{ transform: isStatusExpanded ? 'translateY(0)' : 'translateY(calc(100% - 108px))' }}
          >
            <button
              type="button"
              onClick={() => setIsStatusExpanded((current) => !current)}
              className="absolute left-1/2 top-0 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-700 shadow ring-1 ring-slate-200 hover:bg-slate-50"
              aria-expanded={isStatusExpanded}
              aria-label="Toggle tracking status panel"
            >
              {isStatusExpanded ? 'ย่อข้อมูล' : 'ดูข้อมูลการเดินทาง'}
              {isStatusExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </button>

            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={DRIVER_AVATAR}
                  alt={DRIVER_NAME}
                  className="h-14 w-14 rounded-full border-2 border-violet-200 object-cover shadow-md"
                />
                <div>
                <p className="text-sm font-semibold text-slate-500">Your Driver</p>
                <h1 className="text-2xl font-black text-slate-800">{DRIVER_NAME}</h1>
                <p className="text-sm font-medium text-slate-600">{VEHICLE}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-100 px-4 py-3">
                <p className="mb-1 flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                  <RouteIcon className="h-4 w-4" />
                  Remaining Distance
                </p>
                <p className="text-lg font-black text-slate-800">{remainingDistanceKm.toFixed(2)} km</p>
              </div>

              <div className="rounded-2xl bg-slate-100 px-4 py-3">
                <p className="mb-1 flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                  <Timer className="h-4 w-4" />
                  ETA
                </p>
                <p className="text-lg font-black text-slate-800">{etaMin} min</p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-slate-500">พูดคุยกับคนขับได้ทันทีระหว่างเดินทาง</p>
              <button
                type="button"
                onClick={() => navigate(`/chat/${activeChatDriverId}`)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white shadow hover:bg-violet-700"
              >
                <MessageCircle className="h-4 w-4" />
                Chat with Driver
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
