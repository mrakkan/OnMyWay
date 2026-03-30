import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { getCurrentMockUserProfile } from '../utils/mockAuthStorage'
import { getPendingRides } from '../utils/pendingRidesStorage'

function createMockNotifications() {
  const pendingRides = getPendingRides()
  const fromRides = pendingRides.slice(0, 3).map((ride, index) => ({
    id: `ride-notification-${ride.id || index}`,
    title: `${ride.driverName || 'Your driver'} updated your ride`,
    detail: ride.location || 'Tap to review ride details',
    href: '/schedule',
    isRead: index > 0,
  }))

  const fallbackNotifications = [
    {
      id: 'system-profile-tip',
      title: 'Complete your profile',
      detail: 'Add your latest address details for smoother pickups.',
      href: '/profile',
      isRead: false,
    },
    {
      id: 'system-chat-ready',
      title: 'Chat is ready',
      detail: 'You can message your assigned driver anytime.',
      href: '/chat',
      isRead: true,
    },
  ]

  return fromRides.length ? [...fromRides, ...fallbackNotifications] : fallbackNotifications
}

function TopNavbar() {
  const location = useLocation()
  const isFindRideActive = location.pathname.startsWith('/find-ride') || location.pathname.startsWith('/driver/')
  const isScheduleActive = location.pathname.startsWith('/schedule')
  const isChatActive = location.pathname.startsWith('/chat') || location.pathname.startsWith('/driver-chat')
  const [isScrolled, setIsScrolled] = useState(false)
  const [notifications, setNotifications] = useState(() => createMockNotifications())
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [currentProfile, setCurrentProfile] = useState(() => getCurrentMockUserProfile())
  const notificationPanelRef = useRef(null)

  const userInitial = currentProfile?.fullName?.trim()?.charAt(0)?.toUpperCase() || 'U'
  const unreadCount = notifications.filter((notification) => !notification.isRead).length

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!notificationPanelRef.current) {
        return
      }

      if (!notificationPanelRef.current.contains(event.target)) {
        setIsNotificationOpen(false)
      }
    }

    window.addEventListener('mousedown', handlePointerDown)
    return () => window.removeEventListener('mousedown', handlePointerDown)
  }, [])

  useEffect(() => {
    setIsNotificationOpen(false)
  }, [location.pathname])

  useEffect(() => {
    setCurrentProfile(getCurrentMockUserProfile())
  }, [location.pathname])

  useEffect(() => {
    const syncProfile = () => {
      setCurrentProfile(getCurrentMockUserProfile())
    }

    window.addEventListener('onmyway:profile-updated', syncProfile)
    window.addEventListener('focus', syncProfile)

    return () => {
      window.removeEventListener('onmyway:profile-updated', syncProfile)
      window.removeEventListener('focus', syncProfile)
    }
  }, [])

  const toggleNotifications = () => {
    setIsNotificationOpen((current) => !current)
  }

  const markAllAsRead = () => {
    setNotifications((current) => current.map((notification) => ({ ...notification, isRead: true })))
  }

  const navItems = [
    { key: 'find-ride', to: '/find-ride', label: 'Find Ride', active: isFindRideActive },
    { key: 'schedule', to: '/schedule', label: 'My Schedule', active: isScheduleActive },
    { key: 'chat', to: '/chat', label: 'Chat', active: isChatActive },
  ]

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
          {navItems.map((item) => (
            <NavLink key={item.key} to={item.to} className={`relative pb-1 ${item.active ? 'text-violet-700' : 'text-slate-700 hover:text-violet-700'}`}>
              <span>{item.label}</span>
              {item.active && (
                <motion.span
                  layoutId="top-navbar-active-underline"
                  className="absolute inset-x-0 -bottom-[3px] h-[3px] rounded-full bg-violet-600"
                  transition={{ type: 'spring', stiffness: 460, damping: 36 }}
                />
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3" ref={notificationPanelRef}>
          <div className="relative">
            <button
              type="button"
              onClick={toggleNotifications}
              className="relative text-violet-700 hover:text-violet-900"
              aria-label="Notifications"
              aria-expanded={isNotificationOpen}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5a4 4 0 00-4 4v2.5L6 14v1h12v-1l-2-2.5V9a4 4 0 00-4-4z" />
                <path d="M10 18a2 2 0 004 0" />
              </svg>

              {unreadCount > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isNotificationOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute right-0 z-50 mt-3 w-[min(22rem,calc(100vw-1.5rem))] rounded-3xl border border-[#e4dbf0] bg-white p-3 shadow-[0_24px_45px_-26px_rgba(59,33,112,0.55)]"
                >
                  <div className="mb-2 flex items-center justify-between px-2">
                    <p className="text-sm font-black uppercase tracking-wide text-slate-700">Notifications</p>
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-xs font-bold uppercase tracking-wide text-violet-700 hover:text-violet-900"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="max-h-[18rem] space-y-2 overflow-y-auto pr-1">
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03, duration: 0.16 }}
                      >
                        <Link
                          to={notification.href}
                          onClick={() => {
                            setNotifications((current) =>
                              current.map((item) => (item.id === notification.id ? { ...item, isRead: true } : item)),
                            )
                          }}
                          className={`block rounded-2xl p-3 transition ${notification.isRead ? 'bg-[#f7f4fb]' : 'bg-violet-50'}`}
                        >
                          <p className="text-sm font-bold text-slate-800">{notification.title}</p>
                          <p className="mt-1 text-xs font-medium text-slate-500">{notification.detail}</p>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/profile"
            aria-label="Profile"
            className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-violet-600 text-sm font-black text-white shadow-[0_12px_22px_-16px_rgba(76,36,168,0.8)] transition hover:bg-violet-700"
          >
            {currentProfile?.avatarDataUrl ? (
              <img
                src={currentProfile.avatarDataUrl}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              userInitial
            )}
          </Link>
        </div>
      </div>

    </header>
  )
}

export default TopNavbar
