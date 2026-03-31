import { useState, useRef, useEffect } from "react";
import { Send, Mic, Paperclip, Bot, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface Message {
  id: number;
  from: "user" | "bot";
  text: string;
  time: string;
}

const QUICK_REPLIES = [
  "Track my order",
  "Book installation",
  "Refund status",
  "Invoice copy",
  "Speak to agent",
];

const BOT_RESPONSES: Record<string, string> = {
  "track my order":
    "Sure! Please share your Order ID (e.g., BB67BDC1E80E074386E2) or I can redirect you to My Orders for real-time tracking. Which do you prefer?",
  "book installation":
    "To book an installation, go to My Orders → select your order → tap the product → 'Create Installation Request'. You can set customer address, preferred date, and time slot. Need help finding the order?",
  "refund status":
    "I can check your refund status. Please share your Return Order Number or I can open the Refunds section for you. Refunds are usually credited within 5–7 business days post return confirmation.",
  "invoice copy":
    "Invoice copies are available in My Orders → tap the order → 'Download Invoice' (PDF). GST-compliant invoices are also emailed to your registered address. Do you need help finding a specific invoice?",
  "speak to agent":
    "Connecting you to a support agent... Our B2B team is available Mon–Sat, 9 AM–6 PM. Current wait time: ~3 minutes. You can also call us at 1800-XXX-XXXX (toll-free).",
  default:
    "Thanks for reaching out! I'm the JMD B2B support assistant. I can help with orders, installations, refunds, invoices, and more. What do you need help with today?",
};

function getTime() {
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function getBotResponse(text: string): string {
  const lower = text.toLowerCase();
  for (const key of Object.keys(BOT_RESPONSES)) {
    if (key !== "default" && lower.includes(key)) {
      return BOT_RESPONSES[key];
    }
  }
  return BOT_RESPONSES["default"];
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    from: "bot",
    text: "Hi Arun! 👋 Welcome to JMD B2B Support. I'm your virtual assistant. How can I help you today?",
    time: getTime(),
  },
];

export default function LiveChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), from: "user", text: text.trim(), time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botMsg: Message = {
        id: Date.now() + 1,
        from: "bot",
        text: getBotResponse(text),
        time: getTime(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1200 + Math.random() * 800);
  };

  return (
    <div className="flex flex-col h-full bg-background -mx-4 -mt-4">
      {/* Chat Header */}
      <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <Link to="/help" className="p-1">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold">JMD Support Bot</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
            <span className="text-[11px] text-white/75">Online · Typically replies instantly</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} items-end gap-2`}
          >
            {msg.from === "bot" && (
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mb-0.5">
                <Bot className="w-3.5 h-3.5 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl ${
                msg.from === "user"
                  ? "bg-primary text-white rounded-br-sm"
                  : "bg-white border border-border text-foreground rounded-bl-sm shadow-sm"
              }`}
            >
              <p className="text-[13px] leading-relaxed">{msg.text}</p>
              <p
                className={`text-[10px] mt-1 ${
                  msg.from === "user" ? "text-white/60 text-right" : "text-muted-foreground"
                }`}
              >
                {msg.time}
              </p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="bg-white border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0ms]"></span>
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:150ms]"></span>
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:300ms]"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-none flex-shrink-0">
        {QUICK_REPLIES.map((qr) => (
          <button
            key={qr}
            onClick={() => sendMessage(qr)}
            className="flex-shrink-0 text-[11px] font-semibold text-primary border border-primary/30 bg-primary/5 px-3 py-1.5 rounded-full whitespace-nowrap active:bg-primary/10 transition-colors"
          >
            {qr}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="px-4 py-3 bg-card border-t border-border flex items-center gap-2 flex-shrink-0">
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Paperclip className="w-5 h-5" />
        </button>
        <div className="flex-1 flex items-center bg-muted rounded-full px-4 py-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
          />
        </div>
        {input.trim() ? (
          <button
            onClick={() => sendMessage(input)}
            className="w-9 h-9 bg-primary rounded-full flex items-center justify-center flex-shrink-0 active:opacity-80 transition-opacity"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        ) : (
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Mic className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
