import './App.css'
import { useEffect, useState } from "react";
import DriverLogin from './page/login'
import DriverRegistration from './page/signup'
import DriverSidebar from './page/sidebar'
import DriverRequests from './page/my-request'
import MyWorkPage from './page/my-works'
import WorkDetail from './page/workdetail';
import Profile from './page/profile';
import Dashboard from './page/dashboard';
import { Navigate, Route, Routes } from 'react-router-dom'

const mockRequests = [
  {
    id: 1,
    name: "Margaret Thompson",
    day: "11/01/2026",
    time: "10:30 AM",
    duration: "3 hrs",
    pickup: "124 Oak Haven",
    destination: "St. Jude Medical Center",
    note: "lorem ipsum dolor sit amet...",
    income: "฿ 1,200",
    phone: "081-234-5678",
    status: "Accepted"
  },
  {
    id: 2,
    name: "Robert Chen",
    day: "11/01/2026",
    time: "11:15 AM",
    duration: "2 hrs",
    pickup: "Willow Creek",
    destination: "Pharmacy",
    note: "Partially blind.",
    income: "฿ 800",
  },
  {
    id: 3,
    name: "Linda Garcia",
    day: "11/01/2026",
    time: "12:45 PM",
    duration: "1 hr",
    pickup: "Golden Age Club",
    destination: "North 5th Ave",
    note: "Carrying groceries.",
    income: "฿ 500",
  },
];

function App() {
  const [requests, setRequests] = useState(mockRequests);
  const [myWork, setMyWork] = useState([]);
  // 🔥 โหลดจาก localStorage ตอนเปิดเว็บ
  useEffect(() => {
    const stored = localStorage.getItem("myWork");
    if (stored) {
      setMyWork(JSON.parse(stored));
    }
  }, []);

  // 🔥 เซฟทุกครั้งที่ myWork เปลี่ยน
  useEffect(() => {
    localStorage.setItem("myWork", JSON.stringify(myWork));
  }, [myWork]);

  const handleAccept = (job) => {
    // เพิ่มเข้า myWork
    setMyWork((prev) => [...prev, job]);

    // ลบจาก requests
    setRequests((prev) => prev.filter((item) => item.id !== job.id));
  };

  const handleDecline = (job) => {
    setRequests((prev) => prev.filter((item) => item.id !== job.id));
  };
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<DriverLogin />} />
      <Route path="/signup" element={<DriverRegistration />} />
      <Route path="/sidebar" element={<DriverSidebar />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/my-request" element={<DriverRequests requests={requests} onAccept={handleAccept} onDecline={handleDecline} />} />
      <Route path="/my-works" element={<MyWorkPage myWork={myWork} />} />
      <Route path="/work/:id" element={<WorkDetail myWork={myWork} setMyWork={setMyWork} />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  )
}

export default App
