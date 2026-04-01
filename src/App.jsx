import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import LightWavesBackground from './components/LightWavesBackground.jsx'
import MobileBottomNav from './components/MobileBottomNav.jsx'
import TopNavbar from './components/TopNavbar.jsx'
import AdminDashboard from './admin/admin-dashboard.jsx'
import DriverRequest from './admin/driver-request.jsx'
import AdminHelpCenter from './admin/help-center.jsx'
import AdminLogin from './admin/login.jsx'
import ManageUser from './admin/manage-user.jsx'
import ManageDriver from './admin/mange-driver.jsx'
import SeeProfile from './admin/profile.jsx'
import DriverDashboard from './driver/dashboard.jsx'
import DriverPassengerChatPage from './driver/chat-passenger.jsx'
import DriverHelpCenter from './driver/help-center.jsx'
import DriverLogin from './driver/login.jsx'
import DriverRequests from './driver/my-request.jsx'
import MyWorkPage from './driver/my-works.jsx'
import DriverProfile from './driver/profile.jsx'
import DriverRegistration from './driver/signup.jsx'
import DriverTrackingPage from './driver/tracking.jsx'
import WorkDetail from './driver/workdetail.jsx'
import DriverChatPage from './pages/DriverChatPage.jsx'
import DriverProfilePage from './pages/DriverProfilePage.jsx'
import FindRidePage from './pages/FindRidePage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import MySchedulePage from './pages/MySchedulePage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import RequestRidePage from './pages/RequestRidePage.jsx'
import SignInPage from './pages/SignInPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import TrackDriverPage from './pages/TrackDriverPage.jsx'
import { seedApprovedDriverMockAccounts } from './utils/driverAuthStorage.js'

const SHARED_WAVES_COLORS = ['#7c3aed', '#8b5cf6', '#a78bfa', '#6d28d9', '#9333ea']

const DRIVER_MOCK_REQUESTS = [
  {
    id: 1,
    name: 'Margaret Thompson',
    day: '11/01/2026',
    time: '10:30 AM',
    duration: '3 hrs',
    pickup: '124 Oak Haven',
    destination: 'St. Jude Medical Center',
    note: 'lorem ipsum dolor sit amet...',
    income: '฿ 1,200',
    phone: '081-234-5678',
    status: 'Accepted',
  },
  {
    id: 2,
    name: 'Robert Chen',
    day: '11/01/2026',
    time: '11:15 AM',
    duration: '2 hrs',
    pickup: 'Willow Creek',
    destination: 'Pharmacy',
    note: 'Partially blind.',
    income: '฿ 800',
  },
  {
    id: 3,
    name: 'Linda Garcia',
    day: '11/01/2026',
    time: '12:45 PM',
    duration: '1 hr',
    pickup: 'Golden Age Club',
    destination: 'North 5th Ave',
    note: 'Carrying groceries.',
    income: '฿ 500',
  },
]

function RideLayout() {
  const location = useLocation()
  const usesSharedWavesBackground =
    location.pathname.startsWith('/find-ride') ||
    location.pathname.startsWith('/schedule') ||
    location.pathname.startsWith('/chat') ||
    location.pathname.startsWith('/driver-chat') ||
    location.pathname.startsWith('/profile')

  return (
    <div className="min-h-screen bg-[#f3eff7]">
      {usesSharedWavesBackground && (
        <LightWavesBackground
          className="pointer-events-none z-0"
          colors={SHARED_WAVES_COLORS}
          speed={0.82}
          intensity={0.52}
        />
      )}
      <TopNavbar />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          className="relative z-10 pb-24 md:pb-0"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
      <MobileBottomNav />
    </div>
  )
}

function App() {
  const [requests, setRequests] = useState(DRIVER_MOCK_REQUESTS)
  const [myWork, setMyWork] = useState([])

  useEffect(() => {
    seedApprovedDriverMockAccounts()
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('myWork')
    if (stored) {
      setMyWork(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('myWork', JSON.stringify(myWork))
  }, [myWork])

  const handleAccept = (job) => {
    setMyWork((prev) => [...prev, job])
    setRequests((prev) => prev.filter((item) => item.id !== job.id))
  }

  const handleDecline = (job) => {
    setRequests((prev) => prev.filter((item) => item.id !== job.id))
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/track-driver" element={<TrackDriverPage />} />
        <Route element={<RideLayout />}>
          <Route path="/find-ride" element={<FindRidePage />} />
          <Route path="/schedule" element={<MySchedulePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/chat" element={<DriverChatPage />} />
          <Route path="/chat/:driverId" element={<DriverChatPage />} />
          <Route path="/driver-chat" element={<DriverChatPage />} />
          <Route path="/driver-chat/:driverId" element={<DriverChatPage />} />
          <Route path="/driver/:driverId" element={<DriverProfilePage />} />
          <Route path="/driver/:driverId/request" element={<RequestRidePage />} />
        </Route>
        <Route path="/driver" element={<Navigate to="/driver/login" replace />} />
        <Route path="/driver/login" element={<DriverLogin />} />
        <Route path="/driver/signup" element={<DriverRegistration />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
        <Route
          path="/driver/my-request"
          element={
            <DriverRequests requests={requests} onAccept={handleAccept} onDecline={handleDecline} />
          }
        />
        <Route path="/driver/my-works" element={<MyWorkPage myWork={myWork} />} />
        <Route path="/driver/work/:id" element={<WorkDetail myWork={myWork} setMyWork={setMyWork} />} />
        <Route path="/driver/tracking" element={<DriverTrackingPage myWork={myWork} setMyWork={setMyWork} />} />
        <Route path="/driver/tracking/:id" element={<DriverTrackingPage myWork={myWork} setMyWork={setMyWork} />} />
        <Route path="/driver/chat" element={<DriverPassengerChatPage myWork={myWork} />} />
        <Route path="/driver/chat/:workId" element={<DriverPassengerChatPage myWork={myWork} />} />
        <Route path="/driver/profile" element={<DriverProfile />} />
        <Route path="/driver/help-center" element={<DriverHelpCenter />} />

        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-driver" element={<ManageDriver />} />
        <Route path="/admin/driver-request" element={<DriverRequest />} />
        <Route path="/admin/profile" element={<SeeProfile />} />
        <Route path="/admin/manage-user" element={<ManageUser />} />
        <Route path="/admin/help-center" element={<AdminHelpCenter />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
