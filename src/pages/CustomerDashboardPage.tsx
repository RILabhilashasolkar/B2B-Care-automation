import { Link, useNavigate } from "react-router-dom";
import { mockCustomerTickets, mockCustomers, mockOrders, type ServiceOrder } from "../lib/mockData";
import {
  Plus, Search, ChevronRight, Phone, Hash, Wrench,
  X, ShoppingBag, AlertOctagon, MessageSquareWarning, ClipboardList,
} from "lucide-react";
import { useState } from "react";

// ── Ticket type classifier ────────────────────────────────────────────────────
const ORDER_CATEGORIES  = new Set(["Order Issues", "Delivery Issues", "Billing & Payments", "Returns & Refunds", "Returns"]);
const SERVICE_CATEGORIES = new Set(["Installation", "Repair & Service"]);
const COMPLAINT_CATEGORIES = new Set(["Complaint Against Service"]);

type TicketKind = "order" | "service" | "complaint";

function classifyTicket(category: string): TicketKind {
  if (ORDER_CATEGORIES.has(category))    return "order";
  if (SERVICE_CATEGORIES.has(category))  return "service";
  if (COMPLAINT_CATEGORIES.has(category)) return "complaint";
  return "service"; // fallback
}

// ── Status badge helper ───────────────────────────────────────────────────────
function statusCls(status: string) {
  if (status === "Open")          return "status-open";
  if (status === "In Progress")   return "status-in-progress";
  if (status === "Awaiting Info") return "status-awaiting";
  if (status === "Resolved")      return "status-resolved";
  return "status-closed";
}

type TabKey = "all" | "order" | "service" | "complaint";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "all",       label: "All",                       icon: Hash },
  { key: "order",     label: "Product Related",           icon: ShoppingBag },
  { key: "service",   label: "Service Request",           icon: Wrench },
  { key: "complaint", label: "Complaints Against Service", icon: AlertOctagon },
];

export default function CustomerDashboardPage() {
  const [search, setSearch]               = useState("");
  const [searchType, setSearchType]       = useState<"mobile" | "serial" | "ticket" | "serviceorder">("mobile");
  const [searchResult, setSearchResult]   = useState<typeof mockCustomers[0] | null>(null);
  const [soResult, setSoResult]           = useState<ServiceOrder | null>(null);
  const [searched, setSearched]           = useState(false);
  const [activeTab, setActiveTab]         = useState<TabKey>("all");
  const navigate = useNavigate();

  const resetSearch = () => {
    setSearch(""); setSearched(false); setSearchResult(null); setSoResult(null);
  };

  const handleSearch = () => {
    setSearched(true);
    setSoResult(null);

    if (searchType === "mobile") {
      setSearchResult(mockCustomers.find((c) => c.mobile.includes(search)) || null);

    } else if (searchType === "serial") {
      setSearchResult(
        mockCustomers.find((c) =>
          c.purchases.some((p) => p.serialNumber.toLowerCase().includes(search.toLowerCase()))
        ) || null
      );

    } else if (searchType === "serviceorder") {
      // Find the service order across all order items
      let matchedSO: ServiceOrder | null = null;
      let matchedCustomer: typeof mockCustomers[0] | null = null;
      outer: for (const order of mockOrders) {
        for (const shipment of order.shipments) {
          for (const item of shipment.items) {
            if (
              item.serviceOrder &&
              item.serviceOrder.id.toLowerCase().includes(search.toLowerCase())
            ) {
              matchedSO = item.serviceOrder;
              matchedCustomer =
                mockCustomers.find((c) => c.mobile === item.serviceOrder!.customerMobile) || null;
              break outer;
            }
          }
        }
      }
      setSoResult(matchedSO);
      setSearchResult(matchedCustomer);

    } else {
      setSearchResult(null);
    }
  };

  const ticketSearchResult = searchType === "ticket" && searched
    ? mockCustomerTickets.filter((t) => t.id.toLowerCase().includes(search.toLowerCase()))
    : [];

  // Categorise all tickets
  const orderTickets    = mockCustomerTickets.filter((t) => classifyTicket(t.category) === "order");
  const serviceTickets  = mockCustomerTickets.filter((t) => classifyTicket(t.category) === "service");
  const complaintTickets = mockCustomerTickets.filter((t) => classifyTicket(t.category) === "complaint");

  const visibleTickets =
    activeTab === "all"       ? mockCustomerTickets :
    activeTab === "order"     ? orderTickets :
    activeTab === "service"   ? serviceTickets :
                                complaintTickets;

  const counts: Record<TabKey, number> = {
    all:       mockCustomerTickets.length,
    order:     orderTickets.length,
    service:   serviceTickets.length,
    complaint: complaintTickets.length,
  };

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-foreground">My Customer — Service Hub</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Raise and track service requests on behalf of your customers</p>
        </div>
        <button
          onClick={() => navigate("/help/complaint?tab=customer")}
          className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold active:opacity-80 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" />
          New Ticket
        </button>
      </div>

      {/* Customer Search */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="text-xs font-bold text-foreground mb-2.5">Find Customer</h3>

        {/* Search type chips */}
        <div className="flex gap-1.5 mb-3 overflow-x-auto phone-scroll pb-0.5">
          {([
            { key: "mobile",       label: "Mobile Number",   icon: Phone },
            { key: "serial",       label: "Serial Number",   icon: Hash },
            { key: "ticket",       label: "Ticket #",        icon: Hash },
            { key: "serviceorder", label: "Service Order #", icon: ClipboardList },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setSearchType(key); resetSearch(); }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-semibold whitespace-nowrap flex-shrink-0 transition-colors ${
                searchType === key
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground"
              }`}
            >
              <Icon className="w-3 h-3" /> {label}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={
                searchType === "mobile"       ? "Enter 10-digit mobile number..." :
                searchType === "serial"       ? "Enter product serial number..." :
                searchType === "serviceorder" ? "Enter service order number (e.g. SO-2024-0001)..." :
                "Enter ticket number..."
              }
              value={search}
              onChange={(e) => { setSearch(e.target.value); setSearched(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-8 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground"
            />
            {search && (
              <button onClick={resetSearch} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 active:opacity-80 transition-opacity"
          >
            Search
          </button>
        </div>

        {/* Search Result — service order */}
        {searched && searchType === "serviceorder" && soResult && searchResult && (
          <div className="mt-3 rounded-xl border border-teal-200 overflow-hidden">
            {/* SO details strip */}
            <div className="bg-teal-50 px-3.5 py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-3.5 h-3.5 text-teal-700 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-teal-900">
                    Service Order: <span className="font-mono">{soResult.id}</span>
                  </p>
                  <p className="text-[10px] text-teal-700 mt-0.5">
                    {soResult.status}
                  </p>
                </div>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                soResult.status === "Closed"
                  ? "bg-emerald-100 text-emerald-700"
                  : soResult.status === "Engineer Visit Pending"
                  ? "bg-amber-100 text-amber-700"
                  : soResult.status === "Engineer On the Way"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-muted text-muted-foreground"
              }`}>
                {soResult.status}
              </span>
            </div>
            {/* Customer row */}
            <Link
              to={`/service/customer/${searchResult.id}`}
              className="flex items-center justify-between px-3.5 py-3 bg-card hover:bg-accent/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">{searchResult.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{searchResult.name}</p>
                  <p className="text-[10px] text-muted-foreground">+91 {searchResult.mobile} · {searchResult.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground">{searchResult.purchases.length} product(s)</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              </div>
            </Link>
          </div>
        )}

        {searched && searchType === "serviceorder" && !soResult && (
          <div className="mt-3 bg-muted/50 rounded-xl p-3.5 text-center">
            <p className="text-xs text-muted-foreground">No service order found with that ID.</p>
          </div>
        )}

        {/* Search Result — customer */}
        {searched && searchType !== "ticket" && searchType !== "serviceorder" && searchResult && (
          <Link
            to={`/service/customer/${searchResult.id}`}
            className="mt-3 block bg-accent/50 rounded-xl p-3.5 hover:bg-accent transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">{searchResult.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{searchResult.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{searchResult.mobile} · {searchResult.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">{searchResult.purchases.length} product(s)</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              </div>
            </div>
          </Link>
        )}

        {searched && searchType !== "ticket" && searchType !== "serviceorder" && !searchResult && (
          <div className="mt-3 bg-muted/50 rounded-xl p-3.5 text-center">
            <p className="text-xs text-muted-foreground">No customer found. Create a ticket from Create Complaint.</p>
            <button
              onClick={() => navigate("/help/complaint?tab=customer")}
              className="mt-2 text-xs text-primary font-semibold hover:underline"
            >
              + Create New Customer Ticket
            </button>
          </div>
        )}

        {/* Search Result — ticket */}
        {searched && searchType === "ticket" && ticketSearchResult.length > 0 && (
          <div className="mt-3 space-y-2">
            {ticketSearchResult.map((ticket) => (
              <Link
                key={ticket.id}
                to={`/ticket/${ticket.id}`}
                className="block bg-accent/50 rounded-xl p-3 hover:bg-accent transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-primary">{ticket.id}</p>
                    <p className="text-xs text-foreground mt-0.5">{ticket.customerName} — {ticket.category}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{ticket.status}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {searched && searchType === "ticket" && ticketSearchResult.length === 0 && (
          <div className="mt-3 bg-muted/50 rounded-xl p-3.5 text-center">
            <p className="text-xs text-muted-foreground">No tickets found with that ID.</p>
          </div>
        )}
      </div>

      {/* ── All Tickets section with type tabs ── */}
      <div>
        {/* Section header */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-foreground">All Tickets ({mockCustomerTickets.length})</h3>
        </div>

        {/* Type tabs */}
        <div className="flex gap-1.5 mb-2 overflow-x-auto phone-scroll pb-0.5">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-semibold whitespace-nowrap flex-shrink-0 transition-colors ${
                activeTab === key
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground"
              }`}
            >
              <Icon className="w-3 h-3" />
              {label}
              {counts[key] > 0 && (
                <span className={`ml-0.5 text-[9px] font-bold px-1 rounded-full ${
                  activeTab === key ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                }`}>
                  {counts[key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab description strip */}
        {activeTab === "order" && (
          <div className="flex items-center gap-1.5 mb-2 px-0.5">
            <ShoppingBag className="w-3 h-3 text-blue-500" />
            <p className="text-[10px] text-muted-foreground">Product, returns & delivery complaints raised for customers</p>
          </div>
        )}
        {activeTab === "service" && (
          <div className="flex items-center gap-1.5 mb-2 px-0.5">
            <Wrench className="w-3 h-3 text-teal-500" />
            <p className="text-[10px] text-muted-foreground">Installation & repair requests · Raise a complaint if service was unsatisfactory</p>
          </div>
        )}
        {activeTab === "complaint" && (
          <div className="flex items-center gap-1.5 mb-2 px-0.5">
            <AlertOctagon className="w-3 h-3 text-red-500" />
            <p className="text-[10px] text-muted-foreground">Escalations against a service order that wasn't resolved properly</p>
          </div>
        )}

        {/* Ticket list */}
        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          {visibleTickets.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-muted-foreground">
              No {activeTab === "all" ? "" : activeTab === "order" ? "product " : activeTab === "service" ? "service " : "complaint "}tickets yet.
            </div>
          ) : (
            visibleTickets.map((ticket) => {
              const kind = classifyTicket(ticket.category);
              return (
                <div key={ticket.id} className="group">
                  <Link
                    to={`/ticket/${ticket.id}`}
                    className="flex items-center justify-between px-3 py-3 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      {/* Badge row */}
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className="text-[11px] font-bold text-primary">{ticket.id}</span>

                        {/* Kind badge */}
                        {kind === "order" && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            <ShoppingBag className="w-2.5 h-2.5" /> Product
                          </span>
                        )}
                        {kind === "service" && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                            <Wrench className="w-2.5 h-2.5" /> Service
                          </span>
                        )}
                        {kind === "complaint" && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full font-semibold bg-red-50 text-red-700 border border-red-200">
                            <AlertOctagon className="w-2.5 h-2.5" /> Complaint
                          </span>
                        )}

                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold priority-${ticket.priority.toLowerCase()}`}>
                          {ticket.priority}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${statusCls(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </div>

                      {/* Content rows */}
                      <p className="text-xs font-medium text-foreground truncate">
                        {ticket.customerName} — {ticket.category} → {ticket.subcategory}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                        {ticket.productName} · {ticket.serialNumber}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Created {new Date(ticket.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })} · {ticket.assignedTo}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-3 flex-shrink-0" />
                  </Link>

                  {/* ── Quick action: Raise Complaint Against Service (only on service tickets) ── */}
                  {kind === "service" && ticket.status !== "Resolved" && ticket.status !== "Closed" && (
                    <button
                      onClick={() =>
                        navigate(
                          `/ticket/create?customerId=${
                            mockCustomers.find((c) => c.mobile === ticket.customerMobile)?.id ?? ""
                          }&category=Complaint+Against+Service&relatedTicket=${ticket.id}&serialNumber=${ticket.serialNumber ?? ""}`
                        )
                      }
                      className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-red-50 border-t border-red-100 hover:bg-red-100 transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <MessageSquareWarning className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                        <span className="text-[10px] font-semibold text-red-700">Raise Complaint Against This Service</span>
                      </div>
                      <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full border border-red-200 font-semibold flex-shrink-0">
                        {ticket.id}
                      </span>
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
