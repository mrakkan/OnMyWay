const DRIVER_PASSENGER_CHAT_THREADS_KEY = 'onmyway:driver-passenger-chat-threads'

function canUseStorage() {
  return typeof window !== 'undefined' && window.localStorage
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
    const rawValue = window.localStorage.getItem(DRIVER_PASSENGER_CHAT_THREADS_KEY)

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

  window.localStorage.setItem(DRIVER_PASSENGER_CHAT_THREADS_KEY, JSON.stringify(nextThreads))
}

export function getPassengerChatThreads() {
  return readThreads()
}

export function upsertPassengerChatThread(threadId, payload) {
  const existingThreads = getPassengerChatThreads()
  const existing = existingThreads[threadId]

  const nextThread = {
    ...existing,
    ...payload,
    threadId,
    updatedAt: Date.now(),
    messages: payload.messages ?? existing?.messages ?? [],
  }

  const nextThreads = {
    ...existingThreads,
    [threadId]: nextThread,
  }

  saveThreads(nextThreads)
  return nextThread
}

export function appendPassengerMessage(threadId, meta, from, text) {
  const existingThreads = getPassengerChatThreads()
  const existing = existingThreads[threadId] ?? {
    threadId,
    passengerName: meta.passengerName || 'Passenger',
    passengerAvatar: meta.passengerAvatar || `https://i.pravatar.cc/150?u=${threadId}`,
    tripLabel: meta.tripLabel || '',
    phone: meta.phone || '',
    messages: [],
  }

  const nextMessage = {
    id: `${threadId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    from,
    text,
    time: nowTimeLabel(),
  }

  const nextThread = {
    ...existing,
    passengerName: meta.passengerName ?? existing.passengerName,
    passengerAvatar: meta.passengerAvatar ?? existing.passengerAvatar,
    tripLabel: meta.tripLabel ?? existing.tripLabel,
    phone: meta.phone ?? existing.phone,
    updatedAt: Date.now(),
    messages: [...existing.messages, nextMessage],
  }

  const nextThreads = {
    ...existingThreads,
    [threadId]: nextThread,
  }

  saveThreads(nextThreads)
  return nextThread
}
