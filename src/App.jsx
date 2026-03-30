import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import AppFooter from './components/AppFooter.jsx'
import TopNavbar from './components/TopNavbar.jsx'
import DriverChatPage from './pages/DriverChatPage.jsx'
import DriverProfilePage from './pages/DriverProfilePage.jsx'
import FindRidePage from './pages/FindRidePage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import MySchedulePage from './pages/MySchedulePage.jsx'
import RequestRidePage from './pages/RequestRidePage.jsx'
import SignInPage from './pages/SignInPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import TrackDriverPage from './pages/TrackDriverPage.jsx'

function RideLayout() {
  return (
    <div className="min-h-screen bg-[#f3eff7]">
      <TopNavbar />
      <Outlet />
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
