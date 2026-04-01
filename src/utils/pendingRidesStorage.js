const PENDING_RIDES_KEY = 'onmyway:pending-rides'
const TAB_SESSION_KEY = 'onmyway:ride-tab-session'
const CHAT_THREADS_KEY = 'onmyway:driver-chat-threads'

function canUseStorage() {
  return typeof window !== 'undefined' && window.localStorage && window.sessionStorage
}

export function initializePendingRideSession() {
  if (!canUseStorage()) {
    return
  }

  const isCurrentTabInitialized = window.sessionStorage.getItem(TAB_SESSION_KEY)

  if (!isCurrentTabInitialized) {
    window.localStorage.removeItem(PENDING_RIDES_KEY)
    window.localStorage.removeItem(CHAT_THREADS_KEY)
    window.sessionStorage.setItem(TAB_SESSION_KEY, 'active')
  }
}

export function getPendingRides() {
  if (!canUseStorage()) {
    return []
  }

  initializePendingRideSession()

  try {
    const rawValue = window.localStorage.getItem(PENDING_RIDES_KEY)

    if (!rawValue) {
      return []
    }

    const parsedValue = JSON.parse(rawValue)
    return Array.isArray(parsedValue) ? parsedValue : []
  } catch {
    return []
  }
}

export function addPendingRide(ride) {
  if (!canUseStorage()) {
    return
  }

  const existingRides = getPendingRides()
  const nextRides = [ride, ...existingRides].slice(0, 12)
  window.localStorage.setItem(PENDING_RIDES_KEY, JSON.stringify(nextRides))
}
