import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DriverSidebar from "./sidebar";
import DriverTopHeader from "./top-header";
import LightWavesBackground from "../components/LightWavesBackground";
import { MapContainer, Marker, Polyline, TileLayer, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const SHARED_WAVES_COLORS = ["#7c3aed", "#8b5cf6", "#a78bfa", "#6d28d9", "#9333ea"];
const DRIVER_SPEED_KMH = 28;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const mockPointByText = {
  "124 Oak Haven": [13.7428, 100.5252],
  "St. Jude Medical Center": [13.7563, 100.5018],
  "Willow Creek": [13.7749, 100.5422],
  Pharmacy: [13.7669, 100.5371],
  "Golden Age Club": [13.7846, 100.5662],
  "North 5th Ave": [13.7894, 100.5527],
};

const getMockCoordinates = (locationText, fallback) => {
  if (!locationText) return fallback;
  return mockPointByText[locationText] || fallback;
};

const toRadians = (degree) => (degree * Math.PI) / 180;

const kmBetweenPoints = (a, b) => {
  const earthRadiusKm = 6371;
  const [lat1, lon1] = a;
  const [lat2, lon2] = b;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const aa =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
  return earthRadiusKm * c;
};

const routeDistanceKm = (points) => {
  let total = 0;

  for (let i = 0; i < points.length - 1; i += 1) {
    total += kmBetweenPoints(points[i], points[i + 1]);
  }

  return total;
};

const createRoutePoints = (origin, destination, segments = 7) => {
  const route = [];

  for (let index = 0; index <= segments; index += 1) {
    const progress = index / segments;
    route.push([
      origin[0] + (destination[0] - origin[0]) * progress,
      origin[1] + (destination[1] - origin[1]) * progress,
    ]);
  }

  return route;
};

export default function DriverTrackingPage({ myWork, setMyWork }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [driverIndex, setDriverIndex] = useState(0);

  const activeWorks = useMemo(() => {
    return (myWork || []).filter((item) => item.status !== "Completed");
  }, [myWork]);

  const selectedJob = useMemo(() => {
    if (!activeWorks.length) return null;
    if (!id) return activeWorks[0];
    return activeWorks.find((item) => item.id === Number(id)) || activeWorks[0];
  }, [activeWorks, id]);

  const pickupCoordinates = useMemo(() => {
    return getMockCoordinates(selectedJob?.pickup, [13.7563, 100.5018]);
  }, [selectedJob]);

  const destinationCoordinates = useMemo(() => {
    return getMockCoordinates(selectedJob?.destination, [13.7462, 100.5347]);
  }, [selectedJob]);

  const routePoints = useMemo(() => {
    return createRoutePoints(pickupCoordinates, destinationCoordinates, 9);
  }, [destinationCoordinates, pickupCoordinates]);

  useEffect(() => {
    setDriverIndex(0);
  }, [selectedJob?.id]);

  useEffect(() => {
    if (routePoints.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      setDriverIndex((current) => {
        if (current >= routePoints.length - 1) {
          return current;
        }
        return current + 1;
      });
    }, 3200);

    return () => window.clearInterval(timer);
  }, [routePoints]);

  if (!selectedJob) {
    return (
      <div className="relative min-h-screen text-on-surface font-[Lexend]">
        <LightWavesBackground
          className="pointer-events-none z-0"
          colors={SHARED_WAVES_COLORS}
          speed={0.82}
          intensity={0.52}
        />

        <div className="relative z-10 flex min-h-screen">
          <DriverSidebar />
          <div className="flex-1 flex flex-col h-screen overflow-y-auto">
            <DriverTopHeader />
            <main className="flex-1 pt-3 pb-10 lg:pb-14">
              <div className="mx-auto w-full max-w-[1240px] px-5 lg:px-8">
                <div className="sun-card sun-card--review p-6 sm:p-8 text-gray-700">
                  <h2 className="text-2xl font-extrabold text-[#24143f]">No active work to track</h2>
                  <p className="mt-2">Accept a request first, then come back to open live map tracking.</p>
                  <Link
                    to="/driver/my-request"
                    className="mt-4 inline-flex rounded-full bg-violet-600 px-5 py-2.5 font-semibold text-white transition hover:bg-violet-700"
                  >
                    Go to My Request
                  </Link>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  const mapCenter = [
    (pickupCoordinates[0] + destinationCoordinates[0]) / 2,
    (pickupCoordinates[1] + destinationCoordinates[1]) / 2,
  ];

  const driverPosition = routePoints[Math.min(driverIndex, routePoints.length - 1)] || pickupCoordinates;
  const traveledRoute = routePoints.slice(0, driverIndex + 1);
  const remainingRoute = routePoints.slice(driverIndex);
  const totalDistanceKm = routeDistanceKm(routePoints);
  const remainingDistanceKm = routeDistanceKm(remainingRoute);
  const progressPercent = totalDistanceKm
    ? Math.round(((totalDistanceKm - remainingDistanceKm) / totalDistanceKm) * 100)
    : 0;
  const etaMin = Math.max(1, Math.round((remainingDistanceKm / DRIVER_SPEED_KMH) * 60));

  const handleCompleteWork = () => {
    if (!selectedJob || typeof setMyWork !== "function") return;

    setMyWork((previous) =>
      previous.map((item) =>
        item.id === selectedJob.id
          ? { ...item, status: "Completed", completedAt: new Date().toISOString() }
          : item
      )
    );

    navigate("/driver/my-works");
  };

  return (
    <div className="relative min-h-screen text-on-surface font-[Lexend]">
      <LightWavesBackground
        className="pointer-events-none z-0"
        colors={SHARED_WAVES_COLORS}
        speed={0.82}
        intensity={0.52}
      />

      <div className="relative z-10 flex min-h-screen">
        <DriverSidebar />

        <div className="flex-1 flex flex-col h-screen overflow-y-auto">
          <DriverTopHeader />

          <main className="flex-1 pt-3 pb-10 lg:pb-14">
            <div className="mx-auto w-full max-w-[1240px] px-5 lg:px-8">
              <h2 className="text-3xl font-extrabold text-[#24143f]">Live Map Tracking</h2>
              <p className="mb-7 mt-2 text-gray-600">
                Driver view for trip #{selectedJob.id} • {selectedJob.name}
              </p>

              {activeWorks.length > 1 && (
                <div className="mb-5 flex flex-wrap gap-2">
                  {activeWorks.map((work) => {
                    const isCurrent = work.id === selectedJob.id;

                    return (
                      <Link
                        key={work.id}
                        to={`/driver/tracking/${work.id}`}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          isCurrent
                            ? "bg-violet-600 text-white"
                            : "border border-violet-200 bg-white text-violet-700 hover:bg-violet-50"
                        }`}
                      >
                        Trip #{work.id}
                      </Link>
                    );
                  })}
                </div>
              )}

              <section className="overflow-hidden rounded-[1.7rem] border border-[#d9d1e8] bg-white/95 shadow-[0_26px_60px_-42px_rgba(43,20,88,0.65)]">
                <div className="h-[50vh] min-h-[320px] w-full lg:h-[62vh]">
                  <MapContainer center={mapCenter} zoom={13} className="h-full w-full" scrollWheelZoom={false}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <Polyline positions={routePoints} pathOptions={{ color: "#d6c7ea", weight: 8 }} />
                    <Polyline positions={traveledRoute} pathOptions={{ color: "#6d3cc5", weight: 8 }} />

                    <Marker position={driverPosition}>
                      <Tooltip direction="top" offset={[0, -14]} opacity={1}>
                        Driver current position
                      </Tooltip>
                    </Marker>

                    <Marker position={pickupCoordinates}>
                      <Tooltip direction="top" offset={[0, -14]} opacity={1}>
                        Pickup point
                      </Tooltip>
                    </Marker>

                    <Marker position={destinationCoordinates}>
                      <Tooltip direction="top" offset={[0, -14]} opacity={1}>
                        Destination
                      </Tooltip>
                    </Marker>
                  </MapContainer>
                </div>

                <div className="grid gap-4 border-t border-[#ece7f6] bg-[#fbf9ff] p-4 md:grid-cols-3">
                  <article className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-700">ETA</p>
                    <p className="mt-1 text-3xl font-black text-[#24143f]">{etaMin} min</p>
                    <p className="text-sm text-gray-500">Estimated to destination</p>
                  </article>

                  <article className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-700">Progress</p>
                    <p className="mt-1 text-3xl font-black text-[#24143f]">{progressPercent}%</p>
                    <p className="text-sm text-gray-500">
                      Remaining {remainingDistanceKm.toFixed(1)} km / {totalDistanceKm.toFixed(1)} km
                    </p>
                  </article>

                  <article className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-700">Trip status</p>
                    <p className="mt-1 text-2xl font-black text-[#24143f]">{selectedJob.status || "Picking Up"}</p>
                    <p className="text-sm text-gray-500">{selectedJob.pickup} → {selectedJob.destination}</p>
                  </article>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#ece7f6] bg-white p-4">
                  <div>
                    <p className="text-sm text-gray-500">Passenger</p>
                    <p className="text-lg font-extrabold text-[#24143f]">{selectedJob.name}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/driver/chat/${selectedJob.id}`}
                      className="inline-flex items-center rounded-full border border-violet-200 px-4 py-2 font-semibold text-violet-700 transition hover:bg-violet-50"
                    >
                      Chat with Passenger
                    </Link>
                    <Link
                      to={`/driver/work/${selectedJob.id}`}
                      className="inline-flex items-center rounded-full bg-violet-600 px-4 py-2 font-semibold text-white transition hover:bg-violet-700"
                    >
                      Open Work Detail
                    </Link>
                    <button
                      type="button"
                      onClick={handleCompleteWork}
                      className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Send Complete
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}