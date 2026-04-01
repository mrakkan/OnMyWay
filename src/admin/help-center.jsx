import React from "react";
import AdminSidebar from "./sidebar";

const getCurrentTime = () =>
  new Date().toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

const quickPrompts = [
  "มีคนขับแจ้งปัญหาระบบ",
  "ผู้ใช้ร้องเรียนการเดินทาง",
  "ขอคู่มืออนุมัติคนขับ",
];

const createBotReply = (messageText) => {
  const text = messageText.toLowerCase();

  if (text.includes("คนขับ") || text.includes("driver")) {
    return "รับเรื่องแล้วค่ะ แนะนำให้ตรวจสถานะเอกสารในหน้า Driver Request และแจ้งผลอนุมัติให้คนขับทราบ";
  }

  if (text.includes("ผู้ใช้") || text.includes("user") || text.includes("ร้องเรียน")) {
    return "รับทราบค่ะ กรุณาระบุเลขงานและเวลาที่เกิดเหตุ เพื่อให้ทีมแอดมินตรวจสอบย้อนหลังได้เร็วขึ้น";
  }

  if (text.includes("อนุมัติ") || text.includes("approve")) {
    return "สามารถจัดการได้ที่หน้า Manage Driver และ Driver Request หากมีเอกสารไม่ครบระบบจะแจ้งสถานะให้ทันที";
  }

  return "ระบบช่วยเหลือแอดมินรับเรื่องแล้วค่ะ หากต้องการส่งต่อทีมเทคนิค กรุณาแนบรายละเอียดปัญหาเพิ่มเติม";
};

export default function AdminHelpCenter() {
  const [messages, setMessages] = React.useState([
    {
      id: 1,
      role: "bot",
      text: "สวัสดีค่ะ Admin Support พร้อมช่วยเหลือการจัดการระบบ แจ้งปัญหาได้เลย",
      time: getCurrentTime(),
    },
  ]);
  const [inputText, setInputText] = React.useState("");
  const nextIdRef = React.useRef(2);
  const messagesContainerRef = React.useRef(null);

  React.useEffect(() => {
    if (!messagesContainerRef.current) return;
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
  }, [messages]);

  const handleSend = (event) => {
    event.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const userMessage = {
      id: nextIdRef.current,
      role: "admin",
      text: trimmed,
      time: getCurrentTime(),
    };
    nextIdRef.current += 1;

    const botMessage = {
      id: nextIdRef.current,
      role: "bot",
      text: createBotReply(trimmed),
      time: getCurrentTime(),
    };
    nextIdRef.current += 1;

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    window.setTimeout(() => {
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#FDF8FD] text-on-surface font-[Lexend] flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <main className="flex-1 px-6 md:px-10 mt-2 md:mt-0 pt-10 pb-10">
          <h2 className="text-3xl font-extrabold mb-2 flex">Help Center</h2>
          <p className="text-gray-500 mb-6 flex">Admin support chat and quick guidance</p>

          <section className="rounded-3xl border border-[#E9DEF8] bg-white shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#EFE4FF] bg-[#F8F4FF] flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#5E3FA3] text-white flex items-center justify-center font-bold shadow-sm">
                A
              </div>
              <div>
                <p className="font-semibold text-[#412B72] leading-tight">Admin Support Assistant</p>
                <p className="text-xs text-[#8A7CA8]">ตอบกลับอัตโนมัติ</p>
              </div>
            </div>

            <div ref={messagesContainerRef} className="h-[460px] overflow-y-auto p-5 space-y-4 bg-[#FCFAFF]">
              {messages.map((message) => {
                const isAdminMessage = message.role === "admin";
                return (
                  <div
                    key={message.id}
                    className={`flex items-end gap-2 ${isAdminMessage ? "justify-end" : "justify-start"}`}
                  >
                    {!isAdminMessage && (
                      <div className="h-8 w-8 rounded-full bg-[#5E3FA3] text-white text-xs font-bold flex items-center justify-center shrink-0">
                        A
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
                        {isAdminMessage ? "คุณ" : "support"} - {message.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-[#EFE4FF] bg-white">
              <div className="mb-3 flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setInputText(prompt)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#F3EFFF] text-[#5A3EA2] border border-[#E4D8FF] hover:bg-[#EADFff] transition"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 md:gap-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={(event) => setInputText(event.target.value)}
                  placeholder="พิมพ์ข้อความถึงระบบช่วยเหลือแอดมิน..."
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
          </section>
        </main>
      </div>
    </div>
  );
}