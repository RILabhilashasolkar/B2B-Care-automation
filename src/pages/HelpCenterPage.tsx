import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Headphones, Users, HelpCircle, Phone, MessageCircle, Mail,
  ChevronRight,
  Package, AlertTriangle, Wrench, X,
  Truck, CreditCard, RotateCcw,
} from "lucide-react";
import {
  mockOrders, mockSelfTickets, mockCustomerTickets
} from "../lib/mockData";

const CALL_CENTRE = "tel:18001234567";

// ── Quick Actions ─────────────────────────────────────────────────────────────
const QUICK_ACTIONS: Array<{ label: string; desc: string; icon: typeof Phone; path?: string; tel?: string; mailto?: string; bg: string; color: string }> = [
  { label: "My Tickets",    desc: "My purchase issues",          icon: Headphones,    path: "/service/self",                       bg: "bg-blue-50",    color: "text-blue-600" },
  { label: "My Customers",  desc: "Customer service hub",        icon: Users,         path: "/service/customer",                   bg: "bg-violet-50",  color: "text-violet-600" },
  { label: "Knowledge Base",desc: "Browse articles",             icon: HelpCircle,    path: "/faq",                                bg: "bg-amber-50",   color: "text-amber-600" },
  { label: "Chat",          desc: "Chat with JMD support",       icon: MessageCircle, path: "/chat",                               bg: "bg-green-50",   color: "text-green-600" },
  { label: "Call Us",       desc: "1800-XXX-XXXX",               icon: Phone,         tel: CALL_CENTRE,                            bg: "bg-pink-50",    color: "text-pink-600" },
  { label: "Email Us",      desc: "jmdpartnercare@ril.com",      icon: Mail,          mailto: "mailto:jmdpartnercare@ril.com",     bg: "bg-cyan-50",    color: "text-cyan-600" },
];

const TOP_FAQ = [
  { q: "How do I book a standard installation?",       tag: "Installation" },
  { q: "Refund not received after return was approved?", tag: "Refund" },
  { q: "How do I download my invoice / bill copy?",    tag: "Billing" },
  { q: "My order is delayed beyond ETA — what to do?", tag: "Delivery" },
  { q: "How to track a service order (SO) status?",    tag: "SO Lookup" },
];

// ── Help Desk data ────────────────────────────────────────────────────────────

// a. Active Orders — shipment-level breakdown
const _today = new Date();
const _allPairs = mockOrders.flatMap(o => o.shipments.map(s => ({ order: o, shipment: s })));

const _delayedShipments      = _allPairs.filter(({ shipment }) =>
  shipment.status === "In Transit" && new Date(shipment.deliveryDate) < _today
);
const _inTransitShipments    = _allPairs.filter(({ shipment }) =>
  shipment.status === "In Transit" && new Date(shipment.deliveryDate) >= _today
);
const _outForDeliveryShipments = _allPairs.filter(({ shipment }) =>
  shipment.status === "Out for Delivery"
);
const _processingOrders      = mockOrders.filter(o => o.status === "Processing");
const activeOrders           = mockOrders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled");

const activeOrderGroups = [
  { label: "Delayed",          cls: "status-awaiting",    count: _delayedShipments.length },
  { label: "In Transit",       cls: "status-in-progress", count: _inTransitShipments.length },
  { label: "Processing",       cls: "status-open",        count: _processingOrders.length },
  { label: "Out for Delivery", cls: "status-resolved",    count: _outForDeliveryShipments.length },
];

// b. Open Refund Tickets (Billing & Payments → Refund Not Received)
const openRefundTickets = mockSelfTickets.filter(t =>
  t.category === "Billing & Payments" &&
  t.subcategory === "Refund Not Received" &&
  t.status !== "Resolved" && t.status !== "Closed"
);

// c. Open Return Tickets (Returns & Refunds category)
const openReturnTickets = mockSelfTickets.filter(t =>
  t.category === "Returns & Refunds" &&
  t.status !== "Resolved" && t.status !== "Closed"
);

// d. Open Installation Requests (customer tickets — Installation category)
const openInstallTickets = mockCustomerTickets.filter(t =>
  t.category === "Installation" &&
  t.status !== "Resolved" && t.status !== "Closed"
);

const installStatusGroups = [
  { label: "Open",          cls: "status-open",        count: openInstallTickets.filter(t => t.status === "Open").length },
  { label: "In Progress",   cls: "status-in-progress", count: openInstallTickets.filter(t => t.status === "In Progress").length },
  { label: "Awaiting Info", cls: "status-awaiting",    count: openInstallTickets.filter(t => t.status === "Awaiting Info").length },
];

const activity = [
  { id: "TKT-S-001",    label: "Damaged Product complaint raised",   time: "2h ago",  status: "Open" },
  { id: "TKT-C-001",    label: "Installation req. for Rajesh Kumar", time: "5h ago",  status: "Open" },
  { id: "TKT-C-002",    label: "AC service for Priya Sharma",        time: "2d ago",  status: "In Progress" },
  { id: "SO-2024-0001", label: "Engineer visit pending — LG AC",     time: "2d ago",  status: "In Progress" },
  { id: "TKT-S-003",    label: "Delivery delay resolved",            time: "4d ago",  status: "Resolved" },
];

type StatKey = "activeOrders" | "refunds" | "returns" | "installations";

const stats: Array<{ key: StatKey; label: string; value: string; change: string; icon: typeof Package; color: string }> = [
  {
    key: "activeOrders",
    label: "Active Orders",
    value: String(activeOrders.length),
    change: `${_delayedShipments.length} delayed · ${_inTransitShipments.length} in transit`,
    icon: Truck,
    color: "primary",
  },
  {
    key: "refunds",
    label: "Open Refund Tickets",
    value: String(openRefundTickets.length),
    change: openRefundTickets.length === 0 ? "None pending" : `${openRefundTickets.length} pending`,
    icon: CreditCard,
    color: "warning",
  },
  {
    key: "returns",
    label: "Open Return Tickets",
    value: String(openReturnTickets.length),
    change: openReturnTickets.length === 0 ? "None pending" : `${openReturnTickets.length} open`,
    icon: RotateCcw,
    color: "info",
  },
  {
    key: "installations",
    label: "Install Requests",
    value: String(openInstallTickets.length),
    change: `${openInstallTickets.filter(t => t.status === "Open").length} new · ${openInstallTickets.filter(t => t.status === "In Progress").length} in progress`,
    icon: Wrench,
    color: "success",
  },
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

  // ── a. Active Orders breakdown ────────────────────────────────────────────
  if (statKey === "activeOrders") return (
    <DetailPanel title="Active Orders Breakdown" linkTo="/orders" linkLabel="View All Orders" onClose={onClose}>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {activeOrderGroups.map(g => (
          <div key={g.label} className="flex items-center justify-between bg-muted/50 rounded-lg px-2.5 py-2">
            <span className="text-[11px] text-foreground font-medium">{g.label}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${g.cls}`}>{g.count}</span>
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Active Orders</p>
        {activeOrders.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-3">No active orders</p>
        ) : activeOrders.map(o => (
          <Link key={o.id} to={`/orders/${o.id}?source=help`} className="flex items-center justify-between py-2 border-b border-border last:border-0 active:opacity-70">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-primary truncate">{o.id.slice(0, 14)}…</p>
              <p className="text-[10px] text-muted-foreground">{o.items} items · ₹{o.total.toLocaleString("en-IN")}</p>
            </div>
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ml-2 ${
              o.status === "In Transit" ? "status-in-progress" : o.status === "Processing" ? "status-open" : "status-closed"
            }`}>{o.status}</span>
          </Link>
        ))}
      </div>
    </DetailPanel>
  );

  // ── b. Open Refund Tickets ────────────────────────────────────────────────
  if (statKey === "refunds") return (
    <DetailPanel title="Open Refund Tickets" linkTo="/service/self" linkLabel="View All Tickets" onClose={onClose}>
      {openRefundTickets.length === 0 ? (
        <div className="py-5 text-center">
          <p className="text-xs font-semibold text-foreground">No open refund tickets</p>
          <p className="text-[10px] text-muted-foreground mt-1">All refund requests are resolved</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {openRefundTickets.map(t => (
            <Link key={t.id} to={`/ticket/${t.id}?source=help`} className="flex items-center justify-between py-2 border-b border-border last:border-0 active:opacity-70">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-primary">{t.id}</p>
                <p className="text-[10px] text-muted-foreground truncate">{t.subcategory}</p>
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ml-2 flex-shrink-0 ${
                t.status === "Open" ? "status-open" : t.status === "In Progress" ? "status-in-progress" : "status-awaiting"
              }`}>{t.status}</span>
            </Link>
          ))}
        </div>
      )}
    </DetailPanel>
  );

  // ── c. Open Return Tickets ────────────────────────────────────────────────
  if (statKey === "returns") return (
    <DetailPanel title="Open Return Tickets" linkTo="/service/self" linkLabel="View All Tickets" onClose={onClose}>
      {openReturnTickets.length === 0 ? (
        <div className="py-5 text-center">
          <p className="text-xs font-semibold text-foreground">No open return tickets</p>
          <p className="text-[10px] text-muted-foreground mt-1">All return requests are resolved</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {openReturnTickets.map(t => (
            <Link key={t.id} to={`/ticket/${t.id}?source=help`} className="flex items-center justify-between py-2 border-b border-border last:border-0 active:opacity-70">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-primary">{t.id}</p>
                <p className="text-[10px] text-muted-foreground truncate">{t.subcategory}</p>
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ml-2 flex-shrink-0 ${
                t.status === "Open" ? "status-open" : t.status === "In Progress" ? "status-in-progress" : "status-awaiting"
              }`}>{t.status}</span>
            </Link>
          ))}
        </div>
      )}
    </DetailPanel>
  );

  // ── d. Open Installation Requests ─────────────────────────────────────────
  return (
    <DetailPanel title="Open Installation Requests" linkTo="/service/customer" linkLabel="View Customer Hub" onClose={onClose}>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {installStatusGroups.map(g => (
          <div key={g.label} className="text-center bg-muted/50 rounded-lg p-2">
            <p className={`text-base font-bold ${
              g.cls === "status-open" ? "text-blue-600"
              : g.cls === "status-in-progress" ? "text-amber-600"
              : "text-red-600"
            }`}>{g.count}</p>
            <p className="text-[9px] text-muted-foreground leading-tight">{g.label}</p>
          </div>
        ))}
      </div>
      {openInstallTickets.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-3">No open installation requests</p>
      ) : (
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Installation Tickets</p>
          {openInstallTickets.map(t => (
            <Link key={t.id} to={`/ticket/${t.id}?source=help`} className="flex items-center justify-between py-2 border-b border-border last:border-0 active:opacity-70">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-primary">{t.id}</p>
                <p className="text-[10px] text-muted-foreground truncate">{t.customerName ?? "—"} · {t.subcategory}</p>
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ml-2 flex-shrink-0 ${
                t.status === "Open" ? "status-open" : t.status === "In Progress" ? "status-in-progress" : "status-awaiting"
              }`}>{t.status}</span>
            </Link>
          ))}
        </div>
      )}
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
        <p className="text-sm text-white/80">JMD B2B Service & Care Hub</p>
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

      {/* Quick Actions — 6 items (3×2) */}
      <div className="px-4 pt-3 pb-2">
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
            ) : a.mailto ? (
              <a key={a.label} href={a.mailto} className={cls}>{inner}</a>
            ) : (
              <Link key={a.label} to={a.path!} className={cls}>{inner}</Link>
            );
          })}
        </div>
      </div>

      {/* JMDO Contact Card */}
      <div className="px-4 py-2">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-border">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Your JioMart Digital Officer
          </p>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary">AA</span>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Abhilash Asolkar</p>
                <p className="text-xs text-muted-foreground">+91 96898 08472</p>
              </div>
            </div>
            <a
              href="tel:+919689808472"
              className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 active:opacity-80 transition-opacity flex-shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              Call
            </a>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 pt-3 pb-1">
        <h2 className="text-sm font-bold text-foreground mb-2">Recent Activity</h2>
        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          {activity.map((item) => (
            <Link
              key={item.id}
              to={item.id.startsWith("SO-") ? "/service/customer" : `/ticket/${item.id}?source=help`}
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
