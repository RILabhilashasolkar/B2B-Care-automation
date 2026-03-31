import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight, ShoppingBag, Headphones, Search,
  Package, Users, AlertTriangle, Wrench, ChevronRight,
  X
} from "lucide-react";
import {
  mockOrders, mockSelfTickets, mockCustomerTickets
} from "../lib/mockData";

// ── Derived data for drill-downs ─────────────────────────────────────────────

const orderStatusGroups = [
  { label: "Delivered",  cls: "status-resolved",    count: mockOrders.filter(o => o.status === "Delivered").length },
  { label: "In Transit", cls: "status-in-progress", count: mockOrders.filter(o => o.status === "In Transit").length },
  { label: "Processing", cls: "status-open",         count: mockOrders.filter(o => o.status === "Processing").length },
  { label: "Cancelled",  cls: "status-closed",       count: mockOrders.filter(o => o.status === "Cancelled").length },
];

const openSelfTickets = mockSelfTickets.filter(t => t.status === "Open" || t.status === "In Progress" || t.status === "Awaiting Info");
const selfPriorityGroups = [
  { label: "High",   cls: "priority-high",   count: openSelfTickets.filter(t => t.priority === "High").length },
  { label: "Medium", cls: "priority-medium", count: openSelfTickets.filter(t => t.priority === "Medium").length },
  { label: "Low",    cls: "priority-low",    count: openSelfTickets.filter(t => t.priority === "Low").length },
];

const activeCustomerTickets = mockCustomerTickets.filter(t => t.status !== "Closed" && t.status !== "Resolved");
const customerStatusGroups = [
  { label: "Open",         cls: "status-open",        count: activeCustomerTickets.filter(t => t.status === "Open").length },
  { label: "In Progress",  cls: "status-in-progress", count: activeCustomerTickets.filter(t => t.status === "In Progress").length },
  { label: "Awaiting Info",cls: "status-awaiting",    count: activeCustomerTickets.filter(t => t.status === "Awaiting Info").length },
];

const installItems = mockOrders
  .flatMap(o => o.shipments.flatMap(s => s.items))
  .filter(i => i.installationEligible || i.installationRequested);
const installGroups = [
  { label: "Eligible (not yet requested)", cls: "status-open",        count: installItems.filter(i => i.installationEligible && !i.installationRequested).length },
  { label: "Requested",                   cls: "status-in-progress",  count: installItems.filter(i => i.installationRequested).length },
  { label: "Not Done by Us",              cls: "status-closed",       count: installItems.filter(i => i.installationNotByUs).length },
];

// ── Quick actions ─────────────────────────────────────────────────────────────
const quickActions = [
  { label: "My Orders",    description: "View B2B orders",    icon: ShoppingBag, path: "/orders" },
  { label: "Self Help",    description: "Raise your tickets", icon: Headphones,  path: "/service/self" },
  { label: "My Customers", description: "Customer service",   icon: Users,       path: "/service/customer" },
  { label: "SO Lookup",    description: "Track service orders", icon: Search,    path: "/service/lookup" },
];

const activity = [
  { id: "TKT-S-001", label: "Damaged Product complaint raised",     time: "2h ago",  status: "Open" },
  { id: "TKT-C-001", label: "Installation req. for Rajesh Kumar",   time: "5h ago",  status: "Open" },
  { id: "TKT-C-002", label: "AC service for Priya Sharma",          time: "2d ago",  status: "In Progress" },
  { id: "SO-2024-0001", label: "Engineer visit pending — LG AC",    time: "2d ago",  status: "In Progress" },
  { id: "TKT-S-003", label: "Delivery delay resolved",              time: "4d ago",  status: "Resolved" },
];

// ── Stat card definitions ─────────────────────────────────────────────────────
type StatKey = "orders" | "tickets" | "customers" | "installations";

const stats: Array<{
  key: StatKey;
  label: string;
  value: string;
  change: string;
  icon: typeof Package;
  color: string;
}> = [
  { key: "orders",        label: "Active Orders", value: "12", change: "+3 this week",   icon: Package,        color: "primary" },
  { key: "tickets",       label: "Open Tickets",  value: "4",  change: "2 high priority", icon: AlertTriangle,  color: "warning" },
  { key: "customers",     label: "Customer Req.", value: "8",  change: "3 pending action", icon: Users,          color: "info" },
  { key: "installations", label: "Installations", value: "5",  change: "2 eligible",       icon: Wrench,         color: "success" },
];

// ── Detail panel content per stat ─────────────────────────────────────────────
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

  // installations
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

function DetailPanel({
  title, linkTo, linkLabel, onClose, children
}: {
  title: string; linkTo: string; linkLabel: string; onClose: () => void; children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-primary/20 rounded-xl mt-2.5 overflow-hidden animate-fade-in shadow-md">
      {/* Panel header */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-primary/5 border-b border-border">
        <p className="text-[11px] font-bold text-primary">{title}</p>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-accent/50 transition-colors">
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
      {/* Content */}
      <div className="px-3 py-3">{children}</div>
      {/* Footer link */}
      <Link
        to={linkTo}
        className="flex items-center justify-center gap-1.5 py-2.5 border-t border-border text-[11px] font-bold text-primary active:bg-primary/5 transition-colors"
      >
        {linkLabel} <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [expandedStat, setExpandedStat] = useState<StatKey | null>(null);

  const handleDoubleClick = (key: StatKey) => {
    setExpandedStat(prev => (prev === key ? null : key));
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Greeting */}
      <div className="pt-1">
        <h1 className="text-base font-bold text-foreground">Welcome back, Arun 👋</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Here's your service activity overview</p>
      </div>

      {/* KPI Stat Cards — 2×2, double-tap to expand */}
      <div>
        <p className="text-[10px] text-muted-foreground mb-1.5 font-medium">Double-tap any card to see details</p>
        <div className="grid grid-cols-2 gap-2.5">
          {stats.map((stat) => {
            const isOpen = expandedStat === stat.key;
            return (
              <div key={stat.key}>
                <button
                  onDoubleClick={() => handleDoubleClick(stat.key)}
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
                  {isOpen && (
                    <p className="text-[9px] text-primary font-semibold mt-1.5">▲ Tap again to close</p>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Detail Panel — rendered below the entire 2×2 grid */}
        {expandedStat && (
          <StatDetail
            statKey={expandedStat}
            onClose={() => setExpandedStat(null)}
          />
        )}
      </div>

      {/* Quick Actions — 2×2 grid */}
      <div>
        <h2 className="text-sm font-bold text-foreground mb-2">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {quickActions.map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="group bg-card rounded-xl border border-border p-3 active:bg-accent/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <action.icon className="w-[18px] h-[18px] text-primary" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary" />
              </div>
              <p className="text-xs font-bold text-foreground">{action.label}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-sm font-bold text-foreground mb-2">Recent Activity</h2>
        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          {activity.map((item) => (
            <Link
              key={item.id}
              to={item.id.startsWith("SO-") ? "/service/lookup" : `/ticket/${item.id}`}
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
    </div>
  );
}
