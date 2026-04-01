import React from "react";
import AdminSidebar from "./sidebar";

const getCurrentTime = () =>
  new Date().toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

const mockDriverChats = [
  {
    driverId: "DRV001",
    driverName: "David Miller",
    status: "online",
    messages: [
      {
        id: 1,
        role: "driver",
        text: "สวัสดีครับ แอดมิน ผู้ใช้ลืมของไว้บนรถครับ",
        time: "09:12",
      },
      {
        id: 2,
        role: "admin",
        text: "รับทราบค่ะ กรุณาแจ้งเลขงานและสถานที่รับผู้ใช้ เดี๋ยวแอดมินประสานต่อให้ค่ะ",
        time: "09:13",
      },
    ],
  },
  {
    driverId: "DRV002",
    driverName: "Anna Lee",
    status: "online",
    messages: [
      {
        id: 1,
        role: "driver",
        text: "รายได้รอบเมื่อวานยังไม่เข้าเลยค่ะ",
        time: "10:40",
      },
    ],
  },
  {
    driverId: "DRV003",
    driverName: "Chris Wong",
    status: "offline",
    messages: [
      {
        id: 1,
        role: "driver",
        text: "ขอสอบถามวิธีแก้ไขเอกสารที่ถูก reject ครับ",
        time: "08:55",
      },
    ],
  },
];

export default function AdminHelpCenter() {
  const [inputText, setInputText] = React.useState("");
  const [selectedDriverId, setSelectedDriverId] = React.useState(mockDriverChats[0].driverId);
  const [chatThreads, setChatThreads] = React.useState(mockDriverChats);
  const messagesContainerRef = React.useRef(null);

  const selectedThread =
    chatThreads.find((thread) => thread.driverId === selectedDriverId) || chatThreads[0];

  React.useEffect(() => {
    if (!messagesContainerRef.current) return;
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
  }, [selectedDriverId, chatThreads]);

  const handleSend = (event) => {
    event.preventDefault();
    const trimmedText = inputText.trim();
    if (!trimmedText) return;

    const nextMessage = {
      id: Date.now(),
      role: "admin",
      text: trimmedText,
      time: getCurrentTime(),
    };

    setChatThreads((prev) =>
      prev.map((thread) =>
        thread.driverId === selectedDriverId
          ? { ...thread, messages: [...thread.messages, nextMessage] }
          : thread
      )
    );

    setInputText("");

    window.setTimeout(() => {
      const driverAutoReply = {
        id: Date.now() + 1,
        role: "driver",
        text: "ขอบคุณครับ",
        time: getCurrentTime(),
      };

      setChatThreads((prev) =>
        prev.map((thread) =>
          thread.driverId === selectedDriverId
            ? { ...thread, messages: [...thread.messages, driverAutoReply] }
            : thread
        )
      );
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#FDF8FD] text-on-surface font-[Lexend] flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <main className="flex-1 px-6 md:px-10 mt-2 md:mt-0 pt-10 pb-10">
          <h2 className="text-3xl font-extrabold mb-2 flex">Help Center</h2>
          <p className="text-gray-500 mb-6 flex">Driver to Admin conversations</p>

          <section className="rounded-3xl border border-[#E9DEF8] bg-white shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] min-h-[620px]">
              <aside className="border-r border-[#EFE4FF] bg-[#FBF9FF]">
                <div className="px-4 py-4 border-b border-[#EFE4FF]">
                  <p className="font-semibold text-[#412B72]">Drivers Inbox</p>
                  <p className="text-xs text-[#8A7CA8] mt-1">เลือกคนขับเพื่อดูบทสนทนา</p>
                </div>

                <div className="p-3 space-y-2">
                  {chatThreads.map((thread) => {
                    const lastMessage = thread.messages[thread.messages.length - 1];
                    const isActive = thread.driverId === selectedDriverId;

                    return (
                      <button
                        key={thread.driverId}
                        type="button"
                        onClick={() => setSelectedDriverId(thread.driverId)}
                        className={`w-full text-left rounded-xl p-3 border transition ${
                          isActive
                            ? "bg-[#EFE6FF] border-[#C9B6F5]"
                            : "bg-white border-[#ECE3FB] hover:bg-[#F7F2FF]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-[#34225F]">{thread.driverName}</p>
                          
                        </div>
                        <p className="text-xs text-[#7D6CA7] mt-1">{thread.driverId}</p>
                        <p className="text-xs text-gray-500 mt-1 truncate">{lastMessage?.text || "No messages"}</p>
                      </button>
                    );
                  })}
                </div>
              </aside>

              <div className="flex flex-col">
                <div className="px-5 py-4 border-b border-[#EFE4FF] bg-[#F8F4FF] flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#5E3FA3] text-white flex items-center justify-center font-bold shadow-sm">
                    {selectedThread?.driverName?.charAt(0) || "D"}
                  </div>
                  <div>
                    <p className="font-semibold text-[#412B72] leading-tight">{selectedThread?.driverName}</p>
                    <p className="text-xs text-[#8A7CA8]">{selectedThread?.driverId}</p>
                  </div>
                </div>

                <div
                  ref={messagesContainerRef}
                  className="h-[480px] overflow-y-auto p-5 space-y-4 bg-[#FCFAFF]"
                >
                  {selectedThread?.messages?.map((message) => {
                    const isAdminMessage = message.role === "admin";

                    return (
                      <div
                        key={message.id}
                        className={`flex items-end gap-2 ${isAdminMessage ? "justify-end" : "justify-start"}`}
                      >
                        {!isAdminMessage && (
                          <div className="h-8 w-8 rounded-full bg-[#5E3FA3] text-white text-xs font-bold flex items-center justify-center shrink-0">
                            D
                          </div>
                        )}

                        <div
                          className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm border ${
                            isAdminMessage
                              ? "bg-[#5B3EA2] text-white rounded-br-sm border-[#4D338B]"
                              : "bg-white text-[#2D1F4D] rounded-bl-sm border-[#E7DDF8]"
                          }`}
                        >
                          <p className="text-sm leading-relaxed text-left">{message.text}</p>
                          <p
                            className={`text-[11px] mt-2 ${
                              isAdminMessage ? "text-purple-100" : "text-[#6B5B8F]"
                            } flex items-center gap-1`}
                          >
                            {isAdminMessage ? "admin" : "driver"} - {message.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleSend} className="p-4 border-t border-[#EFE4FF] bg-white">
                  <div className="flex gap-2 md:gap-3">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(event) => setInputText(event.target.value)}
                      placeholder="พิมพ์ข้อความตอบกลับคนขับ..."
                      className="flex-1 rounded-xl border border-[#E6DBFA] px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#9A84D9]"
                    />
                    <button
                      type="submit"
                      className="px-5 py-3 rounded-xl bg-[#5B3EA2] text-white font-semibold hover:bg-[#4f348d] transition shadow-sm"
                    >
                      <span className="material-symbols-outlined">send</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
