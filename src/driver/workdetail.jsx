import { useParams } from "react-router-dom";
import DriverSidebar from "./sidebar";
import DriverTopHeader from "./top-header";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const statusList = [
  {
    label: "Picking",
    value: "Picking Up",
    active: "bg-blue-500 text-white text-sm",
    inactive: "bg-blue-100 text-blue-600 hover:bg-blue-200 text-sm p-1",
  },
  {
    label: "Hospital",
    value: "At Hospital",
    active: "bg-yellow-500 text-white text-sm",
    inactive: "bg-yellow-100 text-yellow-600 hover:bg-yellow-200 text-sm p-1",
  },
  {
    label: "Delivering",
    value: "Delivering",
    active: "bg-purple-500 text-white text-sm",
    inactive: "bg-purple-100 text-purple-600 hover:bg-purple-200 text-sm p-1",
  },
  {
    label: "Done",
    value: "Completed",
    active: "bg-green-600 text-white text-sm",
    inactive: "bg-green-100 text-green-600 hover:bg-green-200 text-sm p-1",
  },
];

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

export default function WorkDetail({ myWork, setMyWork }) {
  const { id } = useParams();

  const job = myWork.find((item) => item.id === Number(id));

  const pickupCoordinates = getMockCoordinates(job?.pickup, [13.7563, 100.5018]);
  const destinationCoordinates = getMockCoordinates(job?.destination, [13.7462, 100.5347]);
  const mapCenter = [
    (pickupCoordinates[0] + destinationCoordinates[0]) / 2,
    (pickupCoordinates[1] + destinationCoordinates[1]) / 2,
  ];
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${pickupCoordinates[0]},${pickupCoordinates[1]}&destination=${destinationCoordinates[0]},${destinationCoordinates[1]}&travelmode=driving`;

  if (!job) {
    return <p className="p-10">Job not found</p>;
  }

  // 🔥 เปลี่ยน status
  const updateStatus = (newStatus) => {
    const updated = myWork.map((item) =>
      item.id === job.id ? { ...item, status: newStatus } : item
    );
    setMyWork(updated);
  };

  return (

    <div className="min-h-screen bg-[#FDF8FD] text-on-surface font-[Lexend] flex">
      <DriverSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <DriverTopHeader />
        <h2 className="text-3xl font-extrabold mb-2 flex  pl-8 mb-6">
            My Work Detail
          </h2>

<div className="p-6 max-w-[900px] w-full mx-auto flex flex-col gap-6">

  {/* HEADER */}
  <div className="bg-white rounded-xl shadow p-6  items-center">
    <div className="flex justify-between items-center gap-4">
      <p className="text-xl font-bold">{job.name}</p>
      <p className="text-gray-500">{job.day} • {job.time}</p>
    </div>

  </div>

  {/* LOCATION */}
  <div className="bg-white rounded-xl shadow p-6 grid md:grid-cols-2 gap-6">

  {/* Pickup */}
  <div>
    <p className="text-sm text-gray-500 flex items-center font-semibold">
      <span className="material-symbols-outlined text-xl rounded-full bg-purple-200 text-purple-600 p-1 mr-2 w-7 h-7 flex items-center justify-center">
        home
      </span>
      Pickup
    </p>
    <p className="mt-1 text-sm pl-9 text-gray-700 flex">{job.pickup}</p>
  </div>

  {/* Destination */}
  <div>
    <p className="text-sm text-gray-500 flex items-center font-semibold">
      <span className="material-symbols-outlined text-xl rounded-full bg-red-200 text-red-600 p-1 mr-2 w-7 h-7 flex items-center justify-center">
        location_on
      </span>
      Destination
    </p>
    <p className="mt-1 text-sm pl-9 text-gray-700 flex">{job.destination}</p>
  </div>

  {/* Duration */}
  <div>
    <p className="text-sm text-gray-500 flex items-center font-semibold">
      <span className="material-symbols-outlined text-xl rounded-full bg-green-200 text-green-600 p-1 mr-2 w-7 h-7 flex items-center justify-center">
        timer
      </span>
      Duration
    </p>
    <p className="mt-1 text-sm pl-9 text-gray-700 flex">{job.duration}</p>
  </div>

  {/* Income */}
  <div>
    <p className="text-sm text-gray-500 flex items-center font-semibold">
      <span className="material-symbols-outlined text-xl rounded-full bg-yellow-200 text-yellow-600 p-1 mr-2 w-7 h-7 flex items-center justify-center">
        monetization_on
      </span>
      Income
    </p>
    <p className="mt-1 text-sm pl-9 text-green-600 font-semibold flex">
      {job.income}
    </p>
  </div>

  <div className=" flex justify-between items-center">
    <div>
        <p className="text-sm text-gray-500 flex items-center font-semibold">
      <span className="material-symbols-outlined text-xl rounded-full bg-pink-200 text-pink-600 p-1 mr-2 w-7 h-7 flex items-center justify-center">
        phone
      </span>
      Contact
    </p>
      <a className="mt-1 text-sm pl-9 text-gray-700 flex underline" href={`tel:${job.phone}`} >{job.phone}
        
      </a>
    </div>
  </div>

  <div>
    <p className="text-sm text-gray-500 flex items-center font-semibold mb-2">
      <span className="material-symbols-outlined text-xl rounded-full bg-green-200 text-green-600 p-1 mr-2 w-7 h-7 flex items-center justify-center ">
        task_alt
      </span>
      Status
    </p>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
  {statusList.map((s) => {
    const isActive = job.status === s.value;

    return (
      <button
        key={s.value}
        onClick={() => updateStatus(s.value)}
        className={`
          p-2 rounded-lg text-[1.7vh] font-medium transition
          ${isActive ? s.active + " shadow-md scale-105" : s.inactive}
        `}
      >
        {s.label}
      </button>
    );
  })}
</div>

  </div>

  {/* <div className="bg-gray-100 p-3 rounded flex flex-col gap-2 text-sm w-full ">
        <p className="font-semibold flex items-center text-gray-700">
          <span className="material-symbols-outlined text-xl w-7 h-7 flex items-center justify-center ">
            notes
          </span>
          User Note
        </p>
        <p className="text-sm flex">{job.note}</p>
      </div> */}
</div>

  {/* CONTACT */}
  

  {/* MAP */}
  <div className="bg-white rounded-xl shadow p-4">
    <div className="h-64 rounded-lg overflow-hidden">
      <MapContainer center={mapCenter} zoom={13} className="h-full w-full" scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={pickupCoordinates}>
          <Popup>Pickup: {job.pickup}</Popup>
        </Marker>
        <Marker position={destinationCoordinates}>
          <Popup>Destination: {job.destination}</Popup>
        </Marker>
        <Polyline positions={[pickupCoordinates, destinationCoordinates]} pathOptions={{ color: "#7C3AED", weight: 4 }} />
      </MapContainer>
    </div>
    <div className="mt-4 flex justify-end">
      <a
        href={googleMapsDirectionsUrl}
        target="_blank"
        rel="noreferrer"
        className="px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
      >
        Open in Google Maps
      </a>
    </div>
  </div>

  {/* STATUS CONTROL */}
  {/* <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">

    <p className="text-sm text-gray-500 font-semibold">Update Status</p>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

      <button
        onClick={() => updateStatus("Picking Up")}
        className="py-2 rounded-lg bg-blue-300 text-white hover:bg-blue-400 transition"
      >
        Picking
      </button>

      <button
        onClick={() => updateStatus("At Hospital")}
        className="py-2 rounded-lg bg-yellow-300 text-white hover:bg-yellow-400 transition"
      >
        Hospital
      </button>

      <button
        onClick={() => updateStatus("Delivering")}
        className="py-2 rounded-lg bg-purple-300 text-white hover:bg-purple-400 transition"
      >
        Delivering
      </button>

      <button
        onClick={() => updateStatus("Completed")}
        className="py-2 rounded-lg bg-green-300 text-white hover:bg-green-500 transition"
      >
        Done
      </button>

    </div>
  </div> */}
</div>
        </div>
        </div>
  );
}