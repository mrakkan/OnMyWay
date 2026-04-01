import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, SendHorizonal } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import LightWavesBackground from '../components/LightWavesBackground'
import {
  appendPassengerMessage,
  getPassengerChatThreads,
  upsertPassengerChatThread,
} from '../utils/driverPassengerChatStorage'
import DriverSidebar from './sidebar'
import DriverTopHeader from './top-header'

const SHARED_WAVES_COLORS = ['#7c3aed', '#8b5cf6', '#a78bfa', '#6d28d9', '#9333ea']

const MOCK_PASSENGER_REPLIES = [
  'โอเคค่ะ ตอนนี้รออยู่หน้าตึกแล้วนะคะ',
  'รับทราบครับ ผมจะลงมาภายใน 2 นาที',
  'เดี๋ยวผมถือของลงมาด้วย ขอบคุณมากครับ',
  'ถ้าถึงแล้วรบกวนบีบแตร 1 ครั้งนะคะ',
]

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
  return lastMessage?.text || 'Start chat with your passenger'
}

function seedInitialPassengerMessage(passengerName) {
  return {
    id: `seed-${Date.now()}`,
    from: 'passenger',
    text: `สวัสดีค่ะ คุณคนขับ ฉันคือ ${passengerName} ถ้าใกล้ถึงแล้วแจ้งได้เลยนะคะ`,
    time: formatUpdatedLabel(Date.now()),
  }
}

function toThreadMeta(job) {
  const passengerName = job?.name || 'Passenger'
  const threadId = String(job?.id)

  return {
    threadId,
    passengerName,
    passengerAvatar: `https://i.pravatar.cc/150?u=passenger-${threadId}`,
    tripLabel: `${job?.pickup || '-'} -> ${job?.destination || '-'}`,
    phone: job?.phone || '',
  }
}

export default function DriverPassengerChatPage({ myWork }) {
  const navigate = useNavigate()
  const { workId: routeWorkId } = useParams()
  const replyIndexRef = useRef(0)
  const replyTimerRef = useRef(null)

  const [threadsMap, setThreadsMap] = useState({})
  const [activeThreadId, setActiveThreadId] = useState('')
  const [draftMessage, setDraftMessage] = useState('')
  const [isPassengerTyping, setIsPassengerTyping] = useState(false)

  useEffect(() => {
    const works = Array.isArray(myWork) ? myWork : []
    let currentThreads = getPassengerChatThreads()

    works.forEach((job) => {
      const meta = toThreadMeta(job)
      const existingThread = currentThreads[meta.threadId]

      const nextThread = upsertPassengerChatThread(meta.threadId, {
        passengerName: meta.passengerName,
        passengerAvatar: meta.passengerAvatar,
        tripLabel: meta.tripLabel,
        phone: meta.phone,
        messages: existingThread?.messages || [seedInitialPassengerMessage(meta.passengerName)],
      })

      currentThreads = {
        ...currentThreads,
        [meta.threadId]: nextThread,
      }
    })

    setThreadsMap(currentThreads)

    const availableThreadIds = Object.keys(currentThreads)

    if (availableThreadIds.length === 0) {
      setActiveThreadId('')
      return
    }

    const initialThreadId =
      routeWorkId && currentThreads[routeWorkId] ? routeWorkId : availableThreadIds[0]

    setActiveThreadId(initialThreadId)
  }, [myWork, routeWorkId])

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

  const activeThread = activeThreadId ? threadsMap[activeThreadId] : null

  const updateFromStorage = () => {
    setThreadsMap(getPassengerChatThreads())
  }

  const onSelectThread = (threadId) => {
    setActiveThreadId(threadId)
    navigate(`/driver/chat/${threadId}`)
  }

  const onBackToList = () => {
    setActiveThreadId('')
    navigate('/driver/chat')
  }

  const onSendMessage = () => {
    const trimmedMessage = draftMessage.trim()

    if (!trimmedMessage || !activeThread) {
      return
    }

    appendPassengerMessage(
      activeThreadId,
      {
        passengerName: activeThread.passengerName,
        passengerAvatar: activeThread.passengerAvatar,
        tripLabel: activeThread.tripLabel,
        phone: activeThread.phone,
      },
      'driver',
      trimmedMessage,
    )

    setDraftMessage('')
    setIsPassengerTyping(true)
    updateFromStorage()

    if (replyTimerRef.current) {
      window.clearTimeout(replyTimerRef.current)
    }

    replyTimerRef.current = window.setTimeout(() => {
      const nextReply = MOCK_PASSENGER_REPLIES[replyIndexRef.current % MOCK_PASSENGER_REPLIES.length]
      replyIndexRef.current += 1

      appendPassengerMessage(
        activeThreadId,
        {
          passengerName: activeThread.passengerName,
          passengerAvatar: activeThread.passengerAvatar,
          tripLabel: activeThread.tripLabel,
          phone: activeThread.phone,
        },
        'passenger',
        nextReply,
      )

      setIsPassengerTyping(false)
      updateFromStorage()
    }, 900)
  }

  return (
    <div className="relative min-h-screen text-on-surface font-[Lexend]">
      <LightWavesBackground
        className="pointer-events-none z-0"
        colors={SHARED_WAVES_COLORS}
        speed={0.82}
        intensity={0.52}
      />

      <div className="relative z-10 flex min-h-screen">
        <DriverSidebar />

        <div className="flex-1 flex flex-col h-screen overflow-y-auto">
          <DriverTopHeader />

          <main className="flex-1 pt-3 pb-10 lg:pb-14">
            <div className="mx-auto w-full max-w-[1240px] px-5 lg:px-8">
              <h2 className="text-3xl font-extrabold text-[#24143f]">Passenger Chat</h2>
              <p className="mt-2 text-gray-600">Chat with your assigned passengers from active works.</p>

              <div className="mt-5 flex min-h-[68vh] overflow-hidden rounded-[1.8rem] border border-[#ddd5ee] bg-white/95 shadow-[0_24px_60px_-44px_rgba(43,20,88,0.65)]">
                <aside
                  className={`border-[#ece7f3] bg-[#f7f5fb] md:flex md:w-[330px] md:flex-col md:border-r ${
                    activeThreadId ? 'hidden' : 'flex w-full flex-1 flex-col'
                  }`}
                >
                  <div className="border-b border-[#ece7f3] bg-white px-5 pt-4">
                    <h3 className="text-2xl font-black text-slate-800">Chats</h3>
                    <p className="pb-4 pt-2 text-sm font-semibold text-slate-400">Passenger conversations</p>
                  </div>

                  <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#f9f7fc] px-4 py-4">
                    {sortedThreads.length > 0 ? (
                      sortedThreads.map((thread) => {
                        const isActive = thread.threadId === activeThreadId

                        return (
                          <button
                            key={thread.threadId}
                            type="button"
                            onClick={() => onSelectThread(thread.threadId)}
                            className={`w-full rounded-3xl px-3 py-3 text-left transition ${
                              isActive ? 'bg-[#e8e1f7] ring-1 ring-[#ded2f3]' : 'bg-white shadow-sm hover:bg-[#f3edf9]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={thread.passengerAvatar}
                                alt={thread.passengerName}
                                className="h-12 w-12 rounded-full object-cover ring-2 ring-white"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="truncate text-lg font-black text-slate-800">{thread.passengerName}</p>
                                  <span className="text-xs font-bold text-slate-400">{formatUpdatedLabel(thread.updatedAt)}</span>
                                </div>
                                <p className="truncate text-xs font-semibold text-violet-700">{thread.tripLabel}</p>
                                <p className="truncate text-sm font-medium text-slate-400">{threadPreview(thread)}</p>
                              </div>
                            </div>
                          </button>
                        )
                      })
                    ) : (
                      <div className="rounded-3xl bg-white p-4 text-sm font-medium text-slate-500 shadow-sm">
                        No active work yet. Accept a request first.
                      </div>
                    )}
                  </div>
                </aside>

                <section className={`min-w-0 flex-1 flex-col bg-white ${!activeThreadId ? 'hidden md:flex' : 'flex'}`}>
                  {activeThread ? (
                    <>
                      <div className="flex items-center justify-between gap-3 border-b border-[#ece7f3] bg-white px-3 py-3 sm:px-6 sm:py-4">
                        <div className="mr-auto flex min-w-0 items-center gap-2 sm:gap-3">
                          <button
                            type="button"
                            onClick={onBackToList}
                            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-[#e8e1f5] md:hidden"
                          >
                            <ChevronLeft className="h-7 w-7" />
                          </button>

                          <img
                            src={activeThread.passengerAvatar}
                            alt={activeThread.passengerName}
                            className="h-10 w-10 rounded-full object-cover sm:h-12 sm:w-12"
                          />

                          <div className="min-w-0">
                            <p className="truncate text-xl font-black leading-tight text-slate-800 sm:text-3xl">
                              {activeThread.passengerName}
                            </p>
                            <div className="flex items-center gap-2 text-xs font-semibold sm:text-sm">
                              <span className="rounded bg-violet-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-violet-700">
                                Passenger
                              </span>
                              <span className="truncate text-slate-500">{activeThread.tripLabel}</span>
                            </div>
                          </div>
                        </div>

                        {activeThread.phone && (
                          <a
                            href={`tel:${activeThread.phone}`}
                            className="hidden rounded-full bg-[#f2eef8] px-4 py-2 text-sm font-bold text-violet-700 transition hover:bg-[#e8e1f5] sm:inline-flex"
                          >
                            Call
                          </a>
                        )}
                      </div>

                      <div className="flex min-h-0 flex-1 flex-col bg-white">
                        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-5 sm:px-6">
                          <div className="mx-auto flex w-fit justify-center rounded-full bg-[#ece7f3] px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-500">
                            Today
                          </div>

                          {(activeThread.messages || []).map((message) => {
                            const isPassenger = message.from === 'passenger'

                            return (
                              <div key={message.id} className={`flex ${isPassenger ? 'justify-start' : 'justify-end'}`}>
                                <div
                                  className={`max-w-[84%] rounded-3xl px-4 py-3 text-[15px] shadow-sm sm:text-lg ${
                                    isPassenger ? 'bg-white text-slate-700 ring-1 ring-[#ece7f3]' : 'bg-violet-600 text-white'
                                  }`}
                                >
                                  <p>{message.text}</p>
                                  <p className={`mt-1 text-xs font-semibold ${isPassenger ? 'text-slate-400' : 'text-violet-100'}`}>
                                    {message.time}
                                  </p>
                                </div>
                              </div>
                            )
                          })}

                          {isPassengerTyping && (
                            <p className="text-sm font-semibold text-slate-500">
                              <span className="mr-2 text-violet-600">•</span>
                              {activeThread.passengerName} is typing...
                            </p>
                          )}
                        </div>

                        <div className="border-t border-[#ece7f3] bg-white px-3 pb-4 pt-3 sm:px-6">
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
                              className="w-full border-0 bg-transparent px-2 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400"
                            />

                            <button
                              type="button"
                              onClick={onSendMessage}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-sm font-black text-white shadow hover:bg-violet-700 sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-2"
                            >
                              <SendHorizonal className="h-5 w-5 sm:h-4 sm:w-4" />
                              <span className="hidden sm:inline">Send</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : Object.keys(threadsMap).length > 0 ? (
                    <div className="hidden flex-1 flex-col items-center justify-center bg-white px-6 text-center md:flex">
                      <h2 className="text-2xl font-black text-slate-800">Select a passenger</h2>
                      <p className="mt-2 max-w-md text-base font-medium text-slate-500">
                        Choose a passenger from the list to start chatting.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 text-center">
                      <h2 className="text-3xl font-black text-slate-800">No Active Work Yet</h2>
                      <p className="mt-2 max-w-md text-base font-medium text-slate-500">
                        Accept a request first, then passenger chat will appear automatically.
                      </p>
                      <Link
                        to="/driver/my-request"
                        className="mt-5 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-violet-700"
                      >
                        Go to My Request
                      </Link>
                    </div>
                  )}
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
