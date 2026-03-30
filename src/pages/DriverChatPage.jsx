import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CircleHelp,
  EllipsisVertical,
  Image,
  Phone,
  PlusCircle,
  Search,
  SendHorizonal,
  Settings,
  Video,
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { appendMessage, getChatThreads, upsertChatThread } from '../utils/driverChatStorage'
import { getPendingRides } from '../utils/pendingRidesStorage'

const MOCK_DRIVER_REPLIES = [
  'รับทราบครับ ผมกำลังขับไปใกล้ถึงแล้วครับ',
  'ไม่ต้องห่วงนะครับ ผมจะโทรแจ้งก่อนถึงประมาณ 2 นาที',
  'ได้เลยครับ เดี๋ยวผมจอดรอด้านหน้าอาคารตามที่แจ้งครับ',
  'ถ้ามีของเยอะผมช่วยถือได้ครับ เดี๋ยวผมลงไปรับ',
]

function normalizeDriverId(driver) {
  if (driver.driverId) {
    return driver.driverId
  }

  if (!driver.driverName) {
    return null
  }

  return driver.driverName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function formatUpdatedLabel(updatedAt) {
  if (!updatedAt) {
    return 'Just now'
  }

  return new Date(updatedAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function threadPreview(thread) {
  const lastMessage = thread.messages?.[thread.messages.length - 1]
  return lastMessage?.text || 'Start chatting with your driver'
}

function seedInitialDriverMessage(driverName) {
  return {
    id: `seed-${Date.now()}`,
    from: 'driver',
    text: `Hi! I am ${driverName}. I will help coordinate your ride safely.`,
    time: formatUpdatedLabel(Date.now()),
  }
}

export default function DriverChatPage() {
  const navigate = useNavigate()
  const { driverId: routeDriverId } = useParams()
  const replyIndexRef = useRef(0)
  const replyTimerRef = useRef(null)

  const [activeTab, setActiveTab] = useState('chat')
  const [threadsMap, setThreadsMap] = useState({})
  const [activeDriverId, setActiveDriverId] = useState('')
  const [draftMessage, setDraftMessage] = useState('')
  const [isDriverTyping, setIsDriverTyping] = useState(false)

  useEffect(() => {
    const pendingRides = getPendingRides()
    const requestedDrivers = []
    const seenDriverIds = new Set()

    pendingRides.forEach((ride) => {
      const id = normalizeDriverId(ride)

      if (!id || seenDriverIds.has(id)) {
        return
      }

      seenDriverIds.add(id)
      requestedDrivers.push({
        driverId: id,
        driverName: ride.driverName || 'Assigned Driver',
        driverAvatar: ride.driverAvatar || `https://i.pravatar.cc/150?u=${id}`,
      })
    })

    let currentThreads = getChatThreads()

    requestedDrivers.forEach((driver) => {
      const existingThread = currentThreads[driver.driverId]

      const nextThread = upsertChatThread(driver.driverId, {
        driverName: driver.driverName,
        driverAvatar: driver.driverAvatar,
        roleLabel: 'DRIVER',
        messages: existingThread?.messages || [seedInitialDriverMessage(driver.driverName)],
      })

      currentThreads = {
        ...currentThreads,
        [driver.driverId]: nextThread,
      }
    })

    setThreadsMap(currentThreads)

    const availableDriverIds = Object.keys(currentThreads)

    if (availableDriverIds.length === 0) {
      setActiveDriverId('')
      return
    }

    const initialDriverId = routeDriverId && currentThreads[routeDriverId] ? routeDriverId : availableDriverIds[0]
    setActiveDriverId(initialDriverId)
  }, [routeDriverId])

  useEffect(() => {
    return () => {
      if (replyTimerRef.current) {
        window.clearTimeout(replyTimerRef.current)
      }
    }
  }, [])

  const sortedThreads = useMemo(() => {
    return Object.values(threadsMap).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
  }, [threadsMap])

  const activeThread = activeDriverId ? threadsMap[activeDriverId] : null
  const activeMessages = activeThread?.messages || []

  const updateFromStorage = () => {
    setThreadsMap(getChatThreads())
  }

  const onSelectThread = (driverId) => {
    setActiveDriverId(driverId)
    navigate(`/chat/${driverId}`)
  }

  const onSendMessage = () => {
    const trimmedMessage = draftMessage.trim()

    if (!trimmedMessage || !activeThread) {
      return
    }

    appendMessage(
      activeDriverId,
      {
        driverName: activeThread.driverName,
        driverAvatar: activeThread.driverAvatar,
      },
      'user',
      trimmedMessage,
    )

    setDraftMessage('')
    setIsDriverTyping(true)
    updateFromStorage()

    if (replyTimerRef.current) {
      window.clearTimeout(replyTimerRef.current)
    }

    replyTimerRef.current = window.setTimeout(() => {
      const nextReply = MOCK_DRIVER_REPLIES[replyIndexRef.current % MOCK_DRIVER_REPLIES.length]
      replyIndexRef.current += 1

      appendMessage(
        activeDriverId,
        {
          driverName: activeThread.driverName,
          driverAvatar: activeThread.driverAvatar,
        },
        'driver',
        nextReply,
      )

      setIsDriverTyping(false)
      updateFromStorage()
    }, 1000)
  }

  return (
    <div className="h-[100dvh] w-full p-2 sm:p-4">
      <div className="mx-auto flex h-full w-full max-w-[1280px] overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_50px_-26px_rgba(94,71,155,0.45)] ring-1 ring-[#e5e0ec]">
        <aside className="hidden w-[320px] border-r border-[#ece7f3] bg-[#f7f5fb] md:flex md:flex-col">
          <div className="border-b border-[#ece7f3] px-5 pt-4">
            <div className="flex items-center gap-6 text-2xl font-black text-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`border-b-[3px] pb-2 text-2xl ${activeTab === 'chat' ? 'border-violet-600 text-violet-700' : 'border-transparent text-slate-400'}`}
              >
                Chat
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('archive')}
                className={`border-b-[3px] pb-2 text-2xl ${activeTab === 'archive' ? 'border-violet-600 text-violet-700' : 'border-transparent text-slate-400'}`}
              >
                Archive
              </button>
            </div>
            <p className="pb-4 pt-3 text-sm font-semibold text-slate-400">Recent Chats</p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {sortedThreads.length > 0 ? (
              sortedThreads.map((thread) => {
                const isActive = thread.driverId === activeDriverId

                return (
                  <button
                    key={thread.driverId}
                    type="button"
                    onClick={() => onSelectThread(thread.driverId)}
                    className={`w-full rounded-3xl px-3 py-3 text-left transition ${
                      isActive ? 'bg-[#e8e1f7] ring-1 ring-[#ded2f3]' : 'bg-white hover:bg-[#f3edf9]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={thread.driverAvatar}
                        alt={thread.driverName}
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-white"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-lg font-black text-slate-800">{thread.driverName}</p>
                          <span className="text-xs font-bold text-slate-400">{formatUpdatedLabel(thread.updatedAt)}</span>
                        </div>
                        <p className="truncate text-sm font-medium text-slate-400">{threadPreview(thread)}</p>
                      </div>
                    </div>
                  </button>
                )
              })
            ) : (
              <div className="rounded-3xl bg-white p-4 text-sm font-medium text-slate-500">
                No requested driver yet.
              </div>
            )}
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-4 border-b border-[#ece7f3] px-4 py-3 sm:px-6">
            <div className="relative hidden max-w-[360px] flex-1 sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full rounded-full border border-transparent bg-[#f2eef8] py-2 pl-9 pr-4 text-sm font-medium text-slate-700 outline-none focus:border-violet-400"
              />
            </div>

          </header>

          {activeThread ? (
            <>
              <div className="flex items-center justify-between gap-3 border-b border-[#ece7f3] px-4 py-4 sm:px-6">

                <div className="mr-auto flex min-w-0 items-center gap-3">
                  <img
                    src={activeThread.driverAvatar}
                    alt={activeThread.driverName}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-3xl font-black leading-tight text-slate-800">{activeThread.driverName}</p>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <span className="rounded bg-violet-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-violet-700">Driver</span>
                      <span className="text-emerald-500">Online now</span>
                    </div>
                  </div>
                </div>

                <div className="hidden items-center gap-2 sm:flex">
                  <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f2eef8] text-violet-700 hover:bg-[#e8e1f5]" aria-label="Call">
                    <Phone className="h-5 w-5" />
                  </button>
                  <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f2eef8] text-violet-700 hover:bg-[#e8e1f5]" aria-label="Video call">
                    <Video className="h-5 w-5" />
                  </button>
                  <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f2eef8] text-violet-700 hover:bg-[#e8e1f5]" aria-label="More options">
                    <EllipsisVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col bg-[#f9f7fc]">
                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-5 sm:px-6">
                  <div className="mx-auto inline-flex rounded-full bg-[#ece7f3] px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-500">
                    Today
                  </div>

                  {activeMessages.map((message) => {
                    const isDriver = message.from === 'driver'

                    return (
                      <div key={message.id} className={`flex ${isDriver ? 'justify-start' : 'justify-end'}`}>
                        <div
                          className={`max-w-[84%] rounded-3xl px-4 py-3 text-lg shadow-sm ${
                            isDriver ? 'bg-white text-slate-700 ring-1 ring-[#ece7f3]' : 'bg-violet-600 text-white'
                          }`}
                        >
                          <p>{message.text}</p>
                          <p className={`mt-1 text-xs font-semibold ${isDriver ? 'text-slate-400' : 'text-violet-100'}`}>{message.time}</p>
                        </div>
                      </div>
                    )
                  })}

                  {isDriverTyping && (
                    <p className="text-sm font-semibold text-slate-500">
                      <span className="mr-2 text-violet-600">•</span>
                      {activeThread.driverName} is typing...
                    </p>
                  )}
                </div>

                <div className="border-t border-[#ece7f3] bg-white px-4 py-4 sm:px-6">
                  <div className="flex items-center gap-2 rounded-full border border-[#e8e1f2] bg-[#f8f6fb] px-3 py-2">

                    <input
                      type="text"
                      value={draftMessage}
                      onChange={(event) => setDraftMessage(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault()
                          onSendMessage()
                        }
                      }}
                      placeholder="Type a message..."
                      className="w-full border-0 bg-transparent px-1 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                    />

                    <button
                      type="button"
                      onClick={onSendMessage}
                      className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-sm font-black text-white shadow hover:bg-violet-700"
                    >
                      <SendHorizonal className="h-4 w-4" />
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <h2 className="text-3xl font-black text-slate-800">No Requested Driver Yet</h2>
              <p className="mt-2 max-w-md text-base font-medium text-slate-500">
                Request a ride first, then your driver-specific chat will appear here automatically.
              </p>
              <Link to="/find-ride" className="mt-5 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-violet-700">
                Find a Driver
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
