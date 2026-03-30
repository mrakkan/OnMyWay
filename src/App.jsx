import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import AppFooter from './components/AppFooter.jsx'
import LightWavesBackground from './components/LightWavesBackground.jsx'
import MobileBottomNav from './components/MobileBottomNav.jsx'
import TopNavbar from './components/TopNavbar.jsx'
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

const SHARED_WAVES_COLORS = ['#7c3aed', '#8b5cf6', '#a78bfa', '#6d28d9', '#9333ea']

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
      <AppFooter />
    </div>
  )
}

function App() {
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
