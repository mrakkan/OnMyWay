import React from "react";
import DriverSidebar from "./sidebar";
import DriverTopHeader from "./top-header";

const createAdminReply = (messageText) => {
  const text = messageText.toLowerCase();

  if (
    text.includes("ลืมของ") ||
    text.includes("forgot") ||
    text.includes("left")
  ) {
    return "รับทราบค่ะ แนะนำให้โทรหาผู้ใช้ทันที และแจ้งข้อมูลรอบงานในระบบ เดี๋ยวแอดมินช่วยประสานให้นะคะ";
  }

  if (text.includes("ยกเลิก") || text.includes("cancel")) {
    return "สามารถกดยกเลิกงานได้ในหน้ารายละเอียดงาน แล้วเลือกเหตุผล ระบบจะอัปเดตให้อัตโนมัติค่ะ";
  }

  if (text.includes("เงิน") || text.includes("payment") || text.includes("รายได้")) {
    return "เรื่องรายได้จะสรุปในระบบหลังงานเสร็จภายใน 24 ชั่วโมง หากยังไม่อัปเดตแจ้งเลขงานมาได้เลยค่ะ";
  }

  return "แอดมินรับเรื่องแล้วค่ะ รบกวนส่งรายละเอียดเพิ่มเติม เช่น เลขงาน เวลา และสถานที่ เพื่อช่วยตรวจสอบได้เร็วขึ้นค่ะ";
};

const getCurrentTime = () =>
  new Date().toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

const quickPrompts = [
  "ผู้ใช้ลืมของบนรถ",
  "รายได้ยังไม่อัปเดต",
  "ขอยกเลิกงานกรณีฉุกเฉิน",
];

export default function HelpCenter() {
  const [inputText, setInputText] = React.useState("");
  const [attachedImage, setAttachedImage] = React.useState("");
  const [messages, setMessages] = React.useState([
    {
      id: 1,
      role: "admin",
      text: "สวัสดีค่ะ แอดมินออนไลน์อยู่ หากมีปัญหาในการรับงานแจ้งได้เลยนะคะ",
      time: getCurrentTime(),
    },
  ]);

  const nextIdRef = React.useRef(2);
  const messagesContainerRef = React.useRef(null);
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    if (!messagesContainerRef.current) return;
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
  }, [messages]);

  const handlePickImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setAttachedImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    const trimmedText = inputText.trim();
    if (!trimmedText && !attachedImage) return;

    const userMessage = {
      id: nextIdRef.current,
      role: "driver",
      text: trimmedText,
      image: attachedImage || "",
      time: getCurrentTime(),
    };
    nextIdRef.current += 1;

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setAttachedImage("");

    const adminMessage = {
      id: nextIdRef.current,
      role: "admin",
      text:
        trimmedText || attachedImage
          ? createAdminReply(trimmedText || "แนบรูป")
          : createAdminReply(""),
      time: getCurrentTime(),
    };
    nextIdRef.current += 1;

    setTimeout(() => {
      setMessages((prev) => [...prev, adminMessage]);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#FDF8FD] text-on-surface font-[Lexend] flex">
      <DriverSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <DriverTopHeader />

      {/* Main */}
        <main className="flex-1 px-6 md:px-10 mt-2 md:mt-0 pt-2 pb-6">
          <h2 className="text-3xl font-extrabold mb-2 flex text-[#2D1F4D]">Help Center Chat</h2>
          

          <section className="relative rounded-3xl shadow-xl border border-[#E9DEF8] overflow-hidden bg-gradient-to-br from-[#FFF7ED] via-[#FFFDF8] to-[#F3EDFF]">
            <div className="pointer-events-none absolute -top-12 -right-10 h-36 w-36 rounded-full bg-[#FFDDBA]/60 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-[#D9D2FF]/50 blur-2xl" />

            <div className="px-5 py-4 border-b border-[#EFE4FF] bg-white/70 backdrop-blur-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#5E3FA3] text-white flex items-center justify-center font-bold shadow-sm">
                  A
                </div>
                <div>
                  <p className="font-semibold text-[#412B72] leading-tight">Admin Support</p>
                  <p className="text-xs text-[#8A7CA8]">ตอบกลับอัตโนมัติ (mock)</p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
                Online
              </span>
            </div>

            <div
              ref={messagesContainerRef}
              className="h-[420px] overflow-y-auto p-5 space-y-4 bg-[linear-gradient(180deg,#fffbf4_0%,#fcf7ff_100%)]"
            >
              {messages.map((message) => {
                const isDriver = message.role === "driver";
                return (
                  <div
                    key={message.id}
                    className={`flex items-end gap-2 ${isDriver ? "justify-end" : "justify-start"}`}
                  >
                    {!isDriver && (
                      <div className="h-8 w-8 rounded-full bg-[#5E3FA3] text-white text-xs font-bold flex items-center justify-center shrink-0">
                        A
                      </div>
                    )}
                    <div
                      className={`relative max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm border ${
                        isDriver
                          ? "bg-[#5B3EA2] text-white rounded-br-sm border-[#4D338B]"
                          : "bg-white text-[#2D1F4D] rounded-bl-sm border-[#E7DDF8]"
                      }`}
                    >
                      <span
                        className={`absolute bottom-2 h-3 w-3 rotate-45 ${
                          isDriver
                            ? "-right-1 bg-[#5B3EA2] border-r border-b border-[#4D338B]"
                            : "-left-1 bg-white border-l border-b border-[#E7DDF8]"
                        }`}
                      />
                      {message.image && (
                        <img
                          src={message.image}
                          alt="attachment"
                          className="w-full max-w-[280px] max-h-60 object-cover rounded-xl mb-2 border border-white/40"
                        />
                      )}
                      {message.text && <p className="text-sm leading-relaxed">{message.text}</p>}
                      <p className={`text-[11px] mt-2 ${isDriver ? "text-purple-100" : "text-[#6B5B8F]"}`}>
                        {isDriver ? "คุณ" : "admin"} • {message.time}
                      </p>
                    </div>
                    {isDriver && (
                      <div className="h-8 w-8 rounded-full bg-[#FFD9A6] text-[#6A3B00] text-xs font-bold flex items-center justify-center shrink-0 border border-[#F2B86A]">
                        D
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-[#EFE4FF] bg-white/80 backdrop-blur-sm">
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

              {attachedImage && (
                <div className="mb-3 inline-flex items-center gap-2 rounded-xl border border-[#E7DDF8] bg-[#FBF8FF] p-2">
                  <img
                    src={attachedImage}
                    alt="selected"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setAttachedImage("")}
                      className="text-sm px-2 py-1 rounded bg-red-100 text-red-700 border border-red-200"
                  >
                    ลบรูป
                  </button>
                </div>
              )}
                <div className="flex gap-2 md:gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePickImage}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-3 rounded-xl border border-[#DCCEFF] bg-white text-[#5E3FA3] font-semibold hover:bg-[#F8F3FB] transition"
                >
                  + รูป
                </button>
                <input
                  type="text"
                  value={inputText}
                  onChange={(event) => setInputText(event.target.value)}
                  placeholder="พิมพ์ข้อความถึงแอดมิน เช่น user ลืมของ..."
                  className="flex-1 rounded-xl border border-[#E6DBFA] px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#9A84D9]"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-[#5B3EA2] text-white font-semibold hover:bg-[#4f348d] transition shadow-sm"
                >
                  ส่ง
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}





