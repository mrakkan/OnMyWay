import { NavLink, useLocation } from 'react-router-dom'

function MobileBottomNav() {
  const location = useLocation()

  const isFindRideActive = location.pathname.startsWith('/find-ride') || location.pathname.startsWith('/driver/')
  const isScheduleActive = location.pathname.startsWith('/schedule')
  const isChatActive = location.pathname.startsWith('/chat') || location.pathname.startsWith('/driver-chat')

  const navItems = [
    {
      key: 'find-ride',
      to: '/find-ride',
      label: 'Find Ride',
      active: isFindRideActive,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 21s-6-5.1-6-10a6 6 0 1112 0c0 4.9-6 10-6 10z" />
          <circle cx="12" cy="11" r="2.5" />
        </svg>
      ),
    },
    {
      key: 'schedule',
      to: '/schedule',
      label: 'Schedule',
      active: isScheduleActive,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18" />
          <path d="M8 3v4M16 3v4" />
        </svg>
      ),
    },
    {
      key: 'chat',
      to: '/chat',
      label: 'Chat',
      active: isChatActive,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v7a2.5 2.5 0 01-2.5 2.5h-6.3L6.8 20v-4H6.5A2.5 2.5 0 014 13.5v-7z" />
        </svg>
      ),
    },
  ]

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] md:hidden">
      <div className="mx-auto mb-3 w-[min(95%,28rem)] rounded-[1.6rem] border border-[#ddd6e7]/90 bg-[#f5f1fa]/95 p-2 pb-[calc(0.55rem+env(safe-area-inset-bottom))] shadow-[0_20px_38px_-24px_rgba(65,39,118,0.7)] backdrop-blur-xl">
        <div className="pointer-events-auto grid grid-cols-3 gap-1">
          {navItems.map((item) => (
            <NavLink
              key={`mobile-${item.key}`}
              to={item.to}
              className={[
                'flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-bold transition',
                item.active
                  ? 'bg-violet-600 text-white shadow-[0_10px_24px_-16px_rgba(90,44,184,0.8)]'
                  : 'text-slate-600 hover:bg-white/70 hover:text-violet-700',
              ].join(' ')}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default MobileBottomNav
