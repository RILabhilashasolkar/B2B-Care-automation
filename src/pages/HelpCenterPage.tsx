import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Headphones, Users, HelpCircle, Phone, MessageCircle,
  TicketCheck, ChevronRight, ArrowRight,
  Package, AlertTriangle, Wrench, X
} from "lucide-react";
import {
  mockOrders, mockSelfTickets, mockCustomerTickets
} from "../lib/mockData";

const CALL_CENTRE = "tel:18001234567";

// ── Quick Actions ─────────────────────────────────────────────────────────────
const QUICK_ACTIONS: Array<{ label: string; desc: string; icon: typeof Phone; path?: string; tel?: string; bg: string; color: string }> = [
  { label: "Self Help",     desc: "My purchase issues",     icon: Headphones,    path: "/service/self",     bg: "bg-blue-50",    color: "text-blue-600" },
  { label: "My Customers",  desc: "Customer service hub",   icon: Users,         path: "/service/customer", bg: "bg-violet-50",  color: "text-violet-600" },
  { label: "Knowledge Base",desc: "Browse articles",        icon: HelpCircle,    path: "/faq",              bg: "bg-amber-50",   color: "text-amber-600" },
  { label: "Chat",          desc: "Chat with JMD support",  icon: MessageCircle, path: "/chat",             bg: "bg-green-50",   color: "text-green-600" },
  { label: "Call Us",       desc: "1800-XXX-XXXX",          icon: Phone,         tel: CALL_CENTRE,          bg: "bg-pink-50",    color: "text-pink-600" },
];

const TOP_FAQ = [
  { q: "How do I book a standard installation?",       tag: "Installation" },
  { q: "Refund not received after return was approved?", tag: "Refund" },
  { q: "How do I download my invoice / bill copy?",    tag: "Billing" },
  { q: "My order is delayed beyond ETA — what to do?", tag: "Delivery" },
  { q: "How to track a service order (SO) status?",    tag: "SO Lookup" },
];

// ── Help Desk data (formerly DashboardPage) ───────────────────────────────────
const orderStatusGroups = [
  { label: "Delivered",  cls: "status-resolved",    count: mockOrders.filter(o => o.status === "Delivered").length },
  { label: "In Transit", cls: "status-in-progress", count: mockOrders.filter(o => o.status === "In Transit").length },
  { label: "Processing", cls: "status-open",         count: mockOrders.filter(o => o.status === "Processing").length },
  { label: "Cancelled",  cls: "status-closed",       count: mockOrders.filter(o => o.status === "Cancelled").length },
];

const openSelfTickets = mockSelfTickets.filter(t =>
  t.status === "Open" || t.status === "In Progress" || t.status === "Awaiting Info"
);
const selfPriorityGroups = [
  { label: "High",   cls: "priority-high",   count: openSelfTickets.filter(t => t.priority === "High").length },
  { label: "Medium", cls: "priority-medium", count: openSelfTickets.filter(t => t.priority === "Medium").length },
  { label: "Low",    cls: "priority-low",    count: openSelfTickets.filter(t => t.priority === "Low").length },
];

const activeCustomerTickets = mockCustomerTickets.filter(t => t.status !== "Closed" && t.status !== "Resolved");
const customerStatusGroups = [
  { label: "Open",          cls: "status-open",        count: activeCustomerTickets.filter(t => t.status === "Open").length },
  { label: "In Progress",   cls: "status-in-progress", count: activeCustomerTickets.filter(t => t.status === "In Progress").length },
  { label: "Awaiting Info", cls: "status-awaiting",    count: activeCustomerTickets.filter(t => t.status === "Awaiting Info").length },
];

const installItems = mockOrders
  .flatMap(o => o.shipments.flatMap(s => s.items))
  .filter(i => i.installationEligible || i.installationRequested);
const installGroups = [
  { label: "Eligible",     cls: "status-open",       count: installItems.filter(i => i.installationEligible && !i.installationRequested).length },
  { label: "Requested",    cls: "status-in-progress", count: installItems.filter(i => i.installationRequested).length },
  { label: "Not by Us",    cls: "status-closed",      count: installItems.filter(i => i.installationNotByUs).length },
];

const activity = [
  { id: "TKT-S-001",    label: "Damaged Product complaint raised",   time: "2h ago",  status: "Open" },
  { id: "TKT-C-001",    label: "Installation req. for Rajesh Kumar", time: "5h ago",  status: "Open" },
  { id: "TKT-C-002",    label: "AC service for Priya Sharma",        time: "2d ago",  status: "In Progress" },
  { id: "SO-2024-0001", label: "Engineer visit pending — LG AC",     time: "2d ago",  status: "In Progress" },
  { id: "TKT-S-003",    label: "Delivery delay resolved",            time: "4d ago",  status: "Resolved" },
];

type StatKey = "orders" | "tickets" | "customers" | "installations";

const stats: Array<{ key: StatKey; label: string; value: string; change: string; icon: typeof Package; color: string }> = [
  { key: "orders",        label: "Active Orders", value: "12", change: "+3 this week",    icon: Package,       color: "primary" },
  { key: "tickets",       label: "Open Tickets",  value: "4",  change: "2 high priority", icon: AlertTriangle, color: "warning" },
  { key: "customers",     label: "Customer Req.", value: "8",  change: "3 pending action", icon: Users,        color: "info" },
  { key: "installations", label: "Installations", value: "5",  change: "2 eligible",       icon: Wrench,       color: "success" },
];

function DetailPanel({ title, linkTo, linkLabel, onClose, children }: {
  title: string; linkTo: string; linkLabel: string; onClose: () => void; children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-primary/20 rounded-xl mt-2.5 overflow-hidden animate-fade-in shadow-md">
      <div className="flex items-center justify-between px-3 py-2.5 bg-primary/5 border-b border-border">
        <p className="text-[11px] font-bold text-primary">{title}</p>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-accent/50">
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
      <div className="px-3 py-3">{children}</div>
      <Link to={linkTo} className="flex items-center justify-center gap-1.5 py-2.5 border-t border-border text-[11px] font-bold text-primary active:bg-primary/5">
        {linkLabel} <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

function StatDetail({ statKey, onClose }: { statKey: StatKey; onClose: () => void }) {
  if (statKey === "orders") return (
    <DetailPanel title="Orders by Status" linkTo="/orders" linkLabel="View All Orders" onClose={onClose}>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {orderStatusGroups.map(g => (
          <div key={g.label} className="flex items-center justify-between bg-muted/50 rounded-lg px-2.5 py-2">
            <span className="text-[11px] text-foreground font-medium">{g.label}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${g.cls}`}>{g.count}</span>
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Recent Orders</p>
        {mockOrders.map(o => (
          <Link key={o.id} to={`/orders/${o.id}`} className="flex items-center justify-between py-2 border-b border-border last:border-0 active:opacity-70">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-primary truncate">{o.id}</p>
              <p className="text-[10px] text-muted-foreground">{o.items} items · ₹{o.total.toLocaleString("en-IN")}</p>
            </div>
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ml-2 ${
              o.status === "Delivered" ? "status-resolved" : o.status === "In Transit" ? "status-in-progress" : o.status === "Processing" ? "status-open" : "status-closed"
            }`}>{o.status}</span>
          </Link>
        ))}
      </div>
    </DetailPanel>
  );

  if (statKey === "tickets") return (
    <DetailPanel title="Open Tickets by Priority" linkTo="/service/self" linkLabel="View All Tickets" onClose={onClose}>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {selfPriorityGroups.map(g => (
          <div key={g.label} className="text-center bg-muted/50 rounded-lg p-2">
            <p className={`text-base font-bold ${g.label === "High" ? "text-red-600" : g.label === "Medium" ? "text-amber-600" : "text-green-700"}`}>{g.count}</p>
            <p className="text-[10px] text-muted-foreground">{g.label}</p>
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Active Tickets</p>
        {openSelfTickets.map(t => (
          <Link key={t.id} to={`/ticket/${t.id}`} className="flex items-center justify-between py-2 border-b border-border last:border-0 active:opacity-70">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[11px] font-bold text-primary">{t.id}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold priority-${t.priority.toLowerCase()}`}>{t.priority}</span>
              </div>
              <p className="text-[10px] text-muted-foreground truncate">{t.category} · {t.subcategory}</p>
            </div>
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ml-2 flex-shrink-0 ${
              t.status === "Open" ? "status-open" : t.status === "In Progress" ? "status-in-progress" : "status-awaiting"
            }`}>{t.status}</span>
          </Link>
        ))}
      </div>
    </DetailPanel>
  );

  if (statKey === "customers") return (
    <DetailPanel title="Customer Requests by Status" linkTo="/service/customer" linkLabel="Open Customer Hub" onClose={onClose}>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {customerStatusGroups.map(g => (
          <div key={g.label} className="text-center bg-muted/50 rounded-lg p-2">
            <p className={`text-base font-bold ${g.label === "Open" ? "text-blue-600" : g.label === "In Progress" ? "text-amber-600" : "text-red-600"}`}>{g.count}</p>
            <p className="text-[10px] text-muted-foreground leading-tight">{g.label}</p>
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Recent Customer Tickets</p>
        {activeCustomerTickets.slice(0, 4).map(t => (
          <Link key={t.id} to={`/ticket/${t.id}`} className="flex items-center justify-between py-2 border-b border-border last:border-0 active:opacity-70">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold text-primary">{t.id}</p>
              <p className="text-[10px] text-muted-foreground truncate">{t.customerName ?? "—"} · {t.category}</p>
            </div>
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ml-2 flex-shrink-0 ${
              t.status === "Open" ? "status-open" : t.status === "In Progress" ? "status-in-progress" : "status-awaiting"
            }`}>{t.status}</span>
          </Link>
        ))}
      </div>
    </DetailPanel>
  );

  return (
    <DetailPanel title="Installation Status" linkTo="/orders" linkLabel="View Orders" onClose={onClose}>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {installGroups.map(g => (
          <div key={g.label} className="text-center bg-muted/50 rounded-lg p-2">
            <p className={`text-base font-bold ${g.cls === "status-open" ? "text-blue-600" : g.cls === "status-in-progress" ? "text-amber-600" : "text-gray-500"}`}>{g.count}</p>
            <p className="text-[9px] text-muted-foreground leading-tight">{g.label}</p>
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Products Pending Installation</p>
        {installItems.slice(0, 4).map(item => (
          <div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-foreground truncate">{item.name}</p>
              <p className="text-[10px] text-muted-foreground">Serial: {item.serialNumber}</p>
            </div>
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ml-2 flex-shrink-0 ${
              item.installationNotByUs ? "status-closed" : item.installationRequested ? "status-in-progress" : "status-open"
            }`}>
              {item.installationNotByUs ? "Not Ours" : item.installationRequested ? "Requested" : "Pending"}
            </span>
          </div>
        ))}
      </div>
    </DetailPanel>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HelpCenterPage() {
  const [expandedStat, setExpandedStat] = useState<StatKey | null>(null);

  return (
    <div className="animate-fade-in pb-4 -mx-4 -mt-4">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-primary to-blue-700 px-4 py-6 text-white">
        <p className="text-xs text-white/70 mb-1">Hi Arun 👋</p>
        <h1 className="text-xl font-bold mb-1">How can we help you?</h1>
        <p className="text-sm text-white/80 mb-4">JMD B2B Service & Care Hub</p>
        <Link
          to="/help/complaint"
          className="inline-flex items-center gap-2 bg-white text-primary text-sm font-bold px-5 py-2.5 rounded-full shadow hover:opacity-90 transition-opacity"
        >
          <TicketCheck className="w-4 h-4" />
          Raise a Support Ticket
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Primary Action Cards */}
      <div className="px-4 pt-3 pb-1">
        <div className="grid grid-cols-2 gap-2.5">
          <Link
            to="/help/complaint"
            className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex flex-col gap-2.5 active:scale-95 transition-transform shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground leading-tight">Create Complaint Ticket</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Self or customer complaint</p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-orange-400 self-end" />
          </Link>
          <Link
            to="/help/installation"
            className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex flex-col gap-2.5 active:scale-95 transition-transform shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground leading-tight">Raise Installation Request</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">For delivered eligible products</p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-teal-400 self-end" />
          </Link>
        </div>
      </div>

      {/* Quick Actions — 5 items */}
      <div className="px-4 pt-4 pb-2">
        <div className="grid grid-cols-3 gap-2.5">
          {QUICK_ACTIONS.map((a) => {
            const cls = "bg-white rounded-xl p-3 flex flex-col items-center gap-2 shadow-sm border border-border active:scale-95 transition-transform";
            const inner = (
              <>
                <div className={`w-10 h-10 rounded-xl ${a.bg} flex items-center justify-center`}>
                  <a.icon className={`w-5 h-5 ${a.color}`} />
                </div>
                <span className="text-[11px] font-semibold text-foreground text-center leading-tight">{a.label}</span>
              </>
            );
            return a.tel ? (
              <a key={a.label} href={a.tel} className={cls}>{inner}</a>
            ) : (
              <Link key={a.label} to={a.path!} className={cls}>{inner}</Link>
            );
          })}
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

      {/* ── Help Desk — KPI Stat Cards (double-tap to drill down) ── */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-foreground">Help Desk Overview</h2>
          <span className="text-[10px] text-muted-foreground">Double-tap card for details</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {stats.map((stat) => {
            const isOpen = expandedStat === stat.key;
            return (
              <div key={stat.key}>
                <button
                  onDoubleClick={() => setExpandedStat(prev => prev === stat.key ? null : stat.key)}
                  className={`w-full text-left bg-card rounded-xl border transition-all duration-200 p-3 active:scale-95 ${
                    isOpen ? "border-primary/40 shadow-md shadow-primary/10" : "border-border"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-${stat.color}/10 flex items-center justify-center mb-2`}>
                    <stat.icon className={`w-4 h-4 text-${stat.color}`} />
                  </div>
                  <p className="text-xl font-bold text-foreground leading-none">{stat.value}</p>
                  <p className="text-[11px] font-semibold text-foreground mt-1">{stat.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{stat.change}</p>
                  {isOpen && <p className="text-[9px] text-primary font-semibold mt-1.5">▲ Tap again to close</p>}
                </button>
              </div>
            );
          })}
        </div>
        {expandedStat && (
          <StatDetail statKey={expandedStat} onClose={() => setExpandedStat(null)} />
        )}
      </div>

      {/* Recent Activity */}
      <div className="px-4 pt-3 pb-1">
        <h2 className="text-sm font-bold text-foreground mb-2">Recent Activity</h2>
        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          {activity.map((item) => (
            <Link
              key={item.id}
              to={item.id.startsWith("SO-") ? "/service/customer" : `/ticket/${item.id}`}
              className="flex items-center gap-3 px-3 py-3 active:bg-accent/10 transition-colors"
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                item.status === "Open" ? "bg-info" : item.status === "In Progress" ? "bg-warning" : "bg-success"
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{item.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{item.id} · {item.time}</p>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                item.status === "Open" ? "status-open" : item.status === "In Progress" ? "status-in-progress" : "status-resolved"
              }`}>
                {item.status}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Frequently Asked */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <h2 className="text-sm font-bold text-foreground">Frequently Asked</h2>
        <Link to="/faq" className="text-xs text-primary font-semibold">See All</Link>
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
                item.tag === "Refund"       ? "bg-red-50 text-red-600" :
                item.tag === "Billing"      ? "bg-amber-50 text-amber-600" :
                item.tag === "Delivery"     ? "bg-green-50 text-green-600" :
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

      {/* Bottom Chat Banner */}
      <div className="mx-4 mt-4 bg-gradient-to-r from-primary to-blue-600 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-white font-bold text-sm">Still need help?</p>
          <p className="text-white/70 text-xs mt-0.5">Talk to our support team</p>
        </div>
        <a
          href={CALL_CENTRE}
          className="flex items-center gap-1.5 bg-white text-primary text-xs font-bold px-3 py-2 rounded-full"
        >
          <Phone className="w-3.5 h-3.5" />
          Call Us
        </a>
      </div>
    </div>
  );
}
