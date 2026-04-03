import { useEffect, useMemo, useState } from 'react'
import { AlertOctagon, CarFront, Home, Hospital, Phone, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, Marker, Polyline, TileLayer, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import AppFooter from '../components/AppFooter'
import TopNavbar from '../components/TopNavbar'
import { getPendingRides } from '../utils/pendingRidesStorage'
import { LightWavesBackground } from '../components/LightWavesBackground'

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

const DRIVER_NAME = 'Anan Srisuk'
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

  const pickupLabel = latestRequestedRide?.pickup || 'Your Residence'
  const destinationLabel = latestRequestedRide?.location || "St. Mary's General Hospital"
  const displayDriverName = latestRequestedRide?.driverName || DRIVER_NAME
  const vehicleLabel = 'Silver Honda Accord'
  const plateLabel = 'AMY-1249'

  return (
    <div className="min-h-screen bg-[#f1eef6] text-slate-800">
      <LightWavesBackground className="pointer-events-none z-0" speed={0.8} intensity={0.5} />
      <TopNavbar />

      <main className="mx-auto max-w-[1240px] px-4 py-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-[#dbd3e8] bg-white shadow-[0_30px_70px_-46px_rgba(43,20,88,0.7)]">
          <div className="relative h-[52vh] min-h-[340px] w-full lg:h-[70vh] lg:min-h-[560px]">
            <MapContainer center={destination} zoom={14} className="h-full w-full" zoomControl={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Polyline positions={MOCK_ROUTE} pathOptions={{ color: '#d6c7ea', weight: 8 }} />
              <Polyline positions={traveledRoute} pathOptions={{ color: '#6d3cc5', weight: 8 }} />

              <Marker position={driverPosition} icon={driverIcon}>
                <Tooltip direction="top" offset={[0, -14]} opacity={1}>
                  Driver now
                </Tooltip>
              </Marker>

              <Marker position={destination} icon={userIcon}>
                <Tooltip direction="top" offset={[0, -12]} opacity={1}>
                  Drop-off point
                </Tooltip>
              </Marker>
            </MapContainer>

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_55%_20%,rgba(255,255,255,0.22),rgba(255,255,255,0)_42%)] lg:bg-[radial-gradient(circle_at_55%_20%,rgba(255,255,255,0.22),rgba(255,255,255,0)_42%)]" />
          </div>

          <div className="relative z-[450] mx-3 mt-4 space-y-4 pb-2 lg:absolute lg:left-6 lg:top-6 lg:mx-0 lg:mt-0 lg:w-[18.5rem] lg:pb-0">
            <article className="rounded-[2rem] bg-white/96 p-6 shadow-[0_16px_36px_-24px_rgba(46,21,94,0.8)] backdrop-blur-sm">
              <p className="text-sm font-bold text-violet-700">Driver is en route</p>
              <p className="mt-2 text-5xl font-black leading-[0.9] text-slate-800 sm:text-6xl">{etaMin}</p>
              <p className="mt-1 text-xl font-black text-slate-800 sm:text-2xl">minutes</p>
              <p className="mt-1 text-base font-medium text-slate-500">Estimated arrival time</p>
            </article>

            <article className="rounded-[2rem] bg-white/96 p-6 shadow-[0_16px_36px_-24px_rgba(46,21,94,0.8)] backdrop-blur-sm">
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                    <Home className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Pickup</p>
                    <p className="text-lg font-black leading-tight text-slate-800 sm:text-xl lg:text-2xl">{pickupLabel}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                    <Hospital className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Drop-off</p>
                    <p className="text-lg font-black leading-tight text-slate-800 sm:text-xl lg:text-2xl">{destinationLabel}</p>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div className="relative z-[450] mx-3 mb-4 mt-4 flex flex-col gap-4 lg:absolute lg:right-6 lg:top-6 lg:mx-0 lg:mb-0 lg:mt-0 lg:w-[18rem]">
            <article className="rounded-[2rem] bg-white/96 p-5 shadow-[0_16px_36px_-24px_rgba(46,21,94,0.8)] backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <img src={DRIVER_AVATAR} alt={displayDriverName} className="h-16 w-16 rounded-full border-2 border-violet-200 object-cover" />
                <div>
                  <p className="text-2xl font-black leading-tight text-slate-800 sm:text-3xl">{displayDriverName}</p>
                  <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-slate-600">
                    <Star className="h-4 w-4 fill-violet-500 text-violet-500" />
                    4.9 <span className="text-slate-500">({Math.max(100, latestRequestedRide?.rides || 128)} rides)</span>
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-3xl bg-[#ebe5f2] px-4 py-3">
                <p className="flex items-center gap-2 text-xl font-black text-slate-800">
                  <CarFront className="h-5 w-5 text-slate-500" />
                  {vehicleLabel}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-500">Plate: {plateLabel}</p>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/chat/${activeChatDriverId}`)}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-4 py-3 text-base font-black text-white shadow-[0_12px_24px_-16px_rgba(64,30,128,0.95)] transition hover:bg-violet-700 sm:text-lg lg:text-xl"
              >
                Chat with Driver
              </button>
            </article>

          </div>

        </section>
      </main>

    </div>
  )
}
