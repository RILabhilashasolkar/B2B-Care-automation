import { Link } from "react-router-dom";
import {
  Headphones, Users, Search, HelpCircle, MessageCircle, Phone,
  Zap, Wrench, Truck, FileText, RotateCcw, Store,
  TicketCheck, ChevronRight, TrendingUp, ArrowRight
} from "lucide-react";

const QUICK_ACTIONS = [
  { label: "Self Help", desc: "My purchase issues", icon: Headphones, path: "/service/self", bg: "bg-blue-50", color: "text-blue-600" },
  { label: "My Customers", desc: "Customer service hub", icon: Users, path: "/service/customer", bg: "bg-violet-50", color: "text-violet-600" },
  { label: "SO Lookup", desc: "Service order status", icon: Search, path: "/service/lookup", bg: "bg-emerald-50", color: "text-emerald-600" },
  { label: "FAQ", desc: "Quick answers", icon: HelpCircle, path: "/faq", bg: "bg-amber-50", color: "text-amber-600" },
  { label: "Live Chat", desc: "Chat with JMD bot", icon: MessageCircle, path: "/chat", bg: "bg-green-50", color: "text-green-600" },
  { label: "Call Us", desc: "1800-XXX-XXXX", icon: Phone, path: "/faq", bg: "bg-pink-50", color: "text-pink-600" },
];

const CATEGORIES = [
  { label: "Demo & Installation", count: 2113, icon: Zap, bg: "bg-blue-50", color: "text-blue-600", path: "/service/customer/create" },
  { label: "Repair & Service", count: 1045, icon: Wrench, bg: "bg-orange-50", color: "text-orange-600", path: "/service/customer/create" },
  { label: "Delivery Issues", count: 83, icon: Truck, bg: "bg-green-50", color: "text-green-600", path: "/service/self/create" },
  { label: "Billing & Invoices", count: 284, icon: FileText, bg: "bg-amber-50", color: "text-amber-600", path: "/service/self/create" },
  { label: "Refunds & Returns", count: 284, icon: RotateCcw, bg: "bg-red-50", color: "text-red-600", path: "/service/self/create" },
  { label: "Store Related", count: 20, icon: Store, bg: "bg-teal-50", color: "text-teal-600", path: "/service/self/create" },
  { label: "SO Follow-up", count: 94, icon: Search, bg: "bg-violet-50", color: "text-violet-600", path: "/service/lookup" },
  { label: "Other Issues", count: 115, icon: HelpCircle, bg: "bg-gray-50", color: "text-gray-500", path: "/service/self/create" },
];

const TOP_FAQ = [
  { q: "How do I book a standard installation?", tag: "Installation" },
  { q: "Refund not received after return was approved?", tag: "Refund" },
  { q: "How do I download my invoice / bill copy?", tag: "Billing" },
  { q: "My order is delayed beyond ETA — what to do?", tag: "Delivery" },
  { q: "How to track a service order (SO) status?", tag: "SO Lookup" },
];

export default function HelpCenterPage() {
  return (
    <div className="animate-fade-in pb-4 -mx-4 -mt-4">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-primary to-blue-700 px-4 py-6 text-white">
        <p className="text-xs text-white/70 mb-1">Hi Arun 👋</p>
        <h1 className="text-xl font-bold mb-1">How can we help you?</h1>
        <p className="text-sm text-white/80 mb-4">JMD B2B Service & Care Hub</p>
        <Link
          to="/service/self/create"
          className="inline-flex items-center gap-2 bg-white text-primary text-sm font-bold px-5 py-2.5 rounded-full shadow hover:opacity-90 transition-opacity"
        >
          <TicketCheck className="w-4 h-4" />
          Raise a Support Ticket
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="px-4 pt-4 pb-2">
        <div className="grid grid-cols-3 gap-2.5">
          {QUICK_ACTIONS.map((a) => (
            <Link
              key={a.path + a.label}
              to={a.path}
              className="bg-white rounded-xl p-3 flex flex-col items-center gap-2 shadow-sm border border-border active:scale-95 transition-transform"
            >
              <div className={`w-10 h-10 rounded-xl ${a.bg} flex items-center justify-center`}>
                <a.icon className={`w-5 h-5 ${a.color}`} />
              </div>
              <span className="text-[11px] font-semibold text-foreground text-center leading-tight">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* My Tickets CTA */}
      <div className="px-4 py-2">
        <Link
          to="/service/self"
          className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm border border-border w-full"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
              <TicketCheck className="w-5 h-5 text-violet-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-foreground">My Tickets</p>
              <p className="text-xs text-muted-foreground">Track your open & past requests</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">2 Open</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </Link>
      </div>

      {/* Browse by Issue Type */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <h2 className="text-sm font-bold text-foreground">Browse by Issue Type</h2>
        <Link to="/service/self/create" className="text-xs text-primary font-semibold">View All</Link>
      </div>
      <div className="px-4 grid grid-cols-2 gap-2.5 pb-2">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.label}
            to={cat.path}
            className="bg-white rounded-xl p-3 shadow-sm border border-border active:scale-95 transition-transform"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-lg ${cat.bg} flex items-center justify-center`}>
                <cat.icon className={`w-4 h-4 ${cat.color}`} />
              </div>
              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                <TrendingUp className="w-2.5 h-2.5" />
                {cat.count.toLocaleString()}
              </span>
            </div>
            <p className="text-xs font-bold text-foreground leading-tight">{cat.label}</p>
          </Link>
        ))}
      </div>

      {/* Frequently Asked */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <h2 className="text-sm font-bold text-foreground">Frequently Asked</h2>
        <Link to="/faq" className="text-xs text-primary font-semibold">See All FAQs</Link>
      </div>
      <div className="mx-4 bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        {TOP_FAQ.map((item, i) => (
          <Link
            key={i}
            to="/faq"
            className="flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0 active:bg-accent/30 transition-colors"
          >
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                item.tag === "Installation" ? "bg-blue-50 text-blue-600" :
                item.tag === "Refund" ? "bg-red-50 text-red-600" :
                item.tag === "Billing" ? "bg-amber-50 text-amber-600" :
                item.tag === "Delivery" ? "bg-green-50 text-green-600" :
                "bg-violet-50 text-violet-600"
              }`}>
                {item.tag}
              </span>
              <span className="text-xs text-foreground font-medium truncate">{item.q}</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0 ml-2" />
          </Link>
        ))}
      </div>

      {/* Live Chat Banner */}
      <div className="mx-4 mt-4 bg-gradient-to-r from-primary to-blue-600 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-white font-bold text-sm">Still need help?</p>
          <p className="text-white/70 text-xs mt-0.5">Talk to our support team</p>
        </div>
        <Link
          to="/chat"
          className="flex items-center gap-1.5 bg-white text-primary text-xs font-bold px-3 py-2 rounded-full"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Live Chat
        </Link>
      </div>
    </div>
  );
}
