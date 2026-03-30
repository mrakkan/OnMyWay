import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

function TopNavbar() {
  const location = useLocation()
  const isFindRideActive = location.pathname.startsWith('/find-ride') || location.pathname.startsWith('/driver/')
  const isScheduleActive = location.pathname.startsWith('/schedule')
  const isChatActive = location.pathname.startsWith('/chat') || location.pathname.startsWith('/driver-chat')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={[
        'sticky top-0 z-50 border-b transition-all duration-300',
        isScrolled
          ? 'border-white/45 bg-[#f3eff7]/60 shadow-[0_8px_30px_-18px_rgba(58,37,102,0.35)] backdrop-blur-xl'
          : 'border-[#ddd6e7] bg-[#f3eff7]/88 backdrop-blur-md',
      ].join(' ')}
    >
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <Link to="/find-ride" className="text-2xl font-black text-violet-700 md:text-3xl">
            OnMyWay
        </Link>

        <nav className="hidden items-center gap-6 text-base font-semibold md:flex">
          <NavLink
            to="/find-ride"
            className={isFindRideActive ? 'border-b-4 border-violet-600 pb-1 text-violet-700' : 'text-slate-700 hover:text-violet-700'}
          >
            Find Ride
          </NavLink>
          <NavLink
            to="/schedule"
            className={isScheduleActive ? 'border-b-4 border-violet-600 pb-1 text-violet-700' : 'text-slate-700 hover:text-violet-700'}
          >
            My Schedule
          </NavLink>
          <NavLink
            to="/chat"
            className={isChatActive ? 'border-b-4 border-violet-600 pb-1 text-violet-700' : 'text-slate-700 hover:text-violet-700'}
          >
            Chat
          </NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <button type="button" className="text-violet-700 hover:text-violet-900" aria-label="Notifications">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5a4 4 0 00-4 4v2.5L6 14v1h12v-1l-2-2.5V9a4 4 0 00-4-4z" />
              <path d="M10 18a2 2 0 004 0" />
            </svg>
          </button>
          <button type="button" className="text-violet-700 hover:text-violet-900" aria-label="Profile">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="3" />
              <path d="M5 19a7 7 0 0114 0" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

export default TopNavbar
