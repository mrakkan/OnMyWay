const CHAT_THREADS_KEY = 'onmyway:driver-chat-threads'
const TAB_SESSION_KEY = 'onmyway:ride-tab-session'

function canUseStorage() {
  return typeof window !== 'undefined' && window.localStorage && window.sessionStorage
}

function nowTimeLabel() {
  return new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function readThreads() {
  if (!canUseStorage()) {
    return {}
  }

  try {
    const rawValue = window.localStorage.getItem(CHAT_THREADS_KEY)

    if (!rawValue) {
      return {}
    }

    const parsedValue = JSON.parse(rawValue)
    return parsedValue && typeof parsedValue === 'object' ? parsedValue : {}
  } catch {
    return {}
  }
}

function saveThreads(nextThreads) {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(CHAT_THREADS_KEY, JSON.stringify(nextThreads))
}

export function initializeDriverChatSession() {
  if (!canUseStorage()) {
    return
  }

  const isCurrentTabInitialized = window.sessionStorage.getItem(TAB_SESSION_KEY)

  if (!isCurrentTabInitialized) {
    window.localStorage.removeItem(CHAT_THREADS_KEY)
    window.sessionStorage.setItem(TAB_SESSION_KEY, 'active')
  }
}

export function getChatThreads() {
  initializeDriverChatSession()
  return readThreads()
}

export function upsertChatThread(driverId, payload) {
  const existingThreads = getChatThreads()
  const existing = existingThreads[driverId]

  const nextThread = {
    ...existing,
    ...payload,
    driverId,
    updatedAt: Date.now(),
    messages: payload.messages ?? existing?.messages ?? [],
  }

  const nextThreads = {
    ...existingThreads,
    [driverId]: nextThread,
  }

  saveThreads(nextThreads)
  return nextThread
}

export function appendMessage(driverId, meta, from, text) {
  const existingThreads = getChatThreads()
  const existing = existingThreads[driverId] ?? {
    driverId,
    driverName: meta.driverName,
    driverAvatar: meta.driverAvatar,
    roleLabel: 'Driver',
    messages: [],
  }

  const nextMessage = {
    id: `${driverId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    from,
    text,
    time: nowTimeLabel(),
  }

  const nextThread = {
    ...existing,
    driverName: meta.driverName ?? existing.driverName,
    driverAvatar: meta.driverAvatar ?? existing.driverAvatar,
    roleLabel: 'Driver',
    updatedAt: Date.now(),
    messages: [...existing.messages, nextMessage],
  }

  const nextThreads = {
    ...existingThreads,
    [driverId]: nextThread,
  }

  saveThreads(nextThreads)
  return nextThread
}
