import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Search, X, Package, Phone, ShieldCheck,
  AlertCircle, ChevronRight, Truck, User, MapPin,
} from "lucide-react";
import {
  mockOrders, mockCustomers,
  type Order, type Shipment, type OrderItem,
} from "../lib/mockData";

// ── Types ─────────────────────────────────────────────────────────────────────
interface SelfResult {
  order: Order;
  shipment: Shipment;
  item: OrderItem;
}

type CustomerSearchMode = "mobile" | "serial";
type TabMode = "self" | "customer";

// ── Helpers ───────────────────────────────────────────────────────────────────
const shipmentStatusBadge = (status: string) =>
  status === "Delivered"
    ? "status-resolved"
    : "status-in-progress";

// ── Self Tab ──────────────────────────────────────────────────────────────────
function SelfTab() {
  const navigate = useNavigate();
  const [query, setQuery] = useState<string>("");

  const trimmed = query.trim().toLowerCase();
  const results: SelfResult[] = [];

  if (trimmed.length >= 3) {
    for (const order of mockOrders) {
      for (const shipment of order.shipments) {
        for (const item of shipment.items) {
          if (
            order.id.toLowerCase().includes(trimmed) ||
            shipment.id.toLowerCase().includes(trimmed) ||
            item.serialNumber.toLowerCase().includes(trimmed) ||
            item.name.toLowerCase().includes(trimmed)
          ) {
            results.push({ order, shipment, item });
          }
        }
      }
    }
  }

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by Order ID, Shipment ID or Serial No."
          className="w-full pl-9 pr-9 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Hint or results */}
      {trimmed.length < 3 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
          <p className="text-xs text-blue-800">
            Type at least 3 characters to search orders, shipments or serial numbers
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-center">
          <Package className="w-10 h-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm font-semibold text-foreground">No items found</p>
          <p className="text-xs text-muted-foreground mt-1">
            Try a different order ID, shipment ID or serial number
          </p>
        </div>
      ) : (
        <>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </p>
          <div className="space-y-2">
            {results.map((r) => (
              <button
                key={`${r.order.id}-${r.item.id}`}
                onClick={() =>
                  navigate(
                    `/ticket/create?orderId=${r.order.id}&itemId=${r.item.id}&shipmentId=${r.shipment.id}`
                  )
                }
                className="w-full text-left bg-card border border-border rounded-xl p-4 hover:border-primary/40 hover:shadow-sm transition-all active:scale-95"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Package className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-foreground leading-tight flex-1 min-w-0 truncate">
                        {r.item.name}
                      </p>
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 flex-shrink-0">
                        {r.item.brand}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                      SN: <span className="font-bold text-foreground">{r.item.serialNumber}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {r.order.id.slice(0, 12)}…
                      </span>
                      <span className="text-muted-foreground text-[10px]">·</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{r.shipment.id}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Truck className="w-3 h-3 text-muted-foreground" />
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${shipmentStatusBadge(r.shipment.status)}`}>
                        {r.shipment.status}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(r.shipment.deliveryDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Customer Tab ──────────────────────────────────────────────────────────────
function CustomerTab() {
  const navigate = useNavigate();
  const [searchMode, setSearchMode] = useState<CustomerSearchMode>("mobile");
  const [query, setQuery] = useState<string>("");

  const trimmed = query.trim().toLowerCase();
  const minChars = 4;
  const ready = trimmed.length >= minChars;

  // ── Mobile mode: find customers whose mobile contains the query ────────────
  type CustomerMatch = { customer: typeof mockCustomers[number]; matchedSerial?: string };
  const customerMatches: CustomerMatch[] = [];

  // ── Serial mode: find items, then look up customer ────────────────────────
  interface PartialMatch {
    order: Order;
    shipment: Shipment;
    item: OrderItem;
    customer: typeof mockCustomers[number] | null;
  }
  const partialMatches: PartialMatch[] = [];

  if (ready) {
    if (searchMode === "mobile") {
      for (const customer of mockCustomers) {
        if (customer.mobile.includes(trimmed)) {
          customerMatches.push({ customer });
        }
      }
    } else {
      // Serial mode
      for (const order of mockOrders) {
        for (const shipment of order.shipments) {
          for (const item of shipment.items) {
            if (item.serialNumber.toLowerCase().includes(trimmed)) {
              const customer =
                mockCustomers.find((c) =>
                  c.purchases.some(
                    (p) => p.serialNumber.toLowerCase() === item.serialNumber.toLowerCase()
                  )
                ) ??
                (item.customerMobile
                  ? mockCustomers.find((c) => c.mobile === item.customerMobile) ?? null
                  : null);
              partialMatches.push({ order, shipment, item, customer });
            }
          }
        }
      }
    }
  }

  const hasResults =
    searchMode === "mobile" ? customerMatches.length > 0 : partialMatches.length > 0;

  return (
    <div className="space-y-3">
      {/* Mode toggle */}
      <div className="flex gap-1 bg-muted rounded-xl p-1">
        {(["mobile", "serial"] as CustomerSearchMode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setSearchMode(m); setQuery(""); }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              searchMode === m
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            {m === "mobile" ? "By Mobile" : "By Serial Number"}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            searchMode === "mobile"
              ? "Enter mobile number (min 4 digits)"
              : "Enter serial number (min 4 chars)"
          }
          className="w-full pl-9 pr-9 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Hint */}
      {!ready ? (
        <div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-3">
          <p className="text-xs text-violet-800">
            {searchMode === "mobile"
              ? "Enter at least 4 digits of the customer's mobile number"
              : "Enter at least 4 characters of the serial number"}
          </p>
        </div>
      ) : !hasResults ? (
        <div className="flex flex-col items-center py-10 text-center">
          <User className="w-10 h-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm font-semibold text-foreground">No customers found</p>
          <p className="text-xs text-muted-foreground mt-1">Try a different search</p>
        </div>
      ) : (
        <>
          {/* ── Mobile mode results ── */}
          {searchMode === "mobile" &&
            customerMatches.map(({ customer }) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onCreateTicket={() => navigate(`/ticket/create?customerId=${customer.id}`)}
              />
            ))}

          {/* ── Serial mode results ── */}
          {searchMode === "serial" &&
            partialMatches.map(({ order, shipment, item, customer }) =>
              customer ? (
                <CustomerCard
                  key={`${customer.id}-${item.id}`}
                  customer={customer}
                  highlightSerial={item.serialNumber}
                  onCreateTicket={() => navigate(`/ticket/create?customerId=${customer.id}`)}
                />
              ) : (
                /* Partial match — item has customerMobile but no Customer record */
                <button
                  key={item.id}
                  onClick={() =>
                    navigate(
                      `/ticket/create?orderId=${order.id}&itemId=${item.id}&shipmentId=${shipment.id}`
                    )
                  }
                  className="w-full text-left bg-violet-50 border border-violet-200 rounded-xl p-4 hover:border-violet-400 transition-all active:scale-95"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-violet-900">Customer Mobile Known</p>
                      {item.customerMobile && (
                        <div className="flex items-center gap-1 mt-1">
                          <Phone className="w-3 h-3 text-violet-600" />
                          <p className="text-xs text-violet-800">+91 {item.customerMobile}</p>
                        </div>
                      )}
                      <p className="text-[10px] text-muted-foreground mt-1 truncate">{item.name}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">
                        SN: {item.serialNumber}
                      </p>
                    </div>
                    <span className="text-[9px] bg-violet-200 text-violet-800 font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                      Create Ticket
                    </span>
                  </div>
                </button>
              )
            )}
        </>
      )}
    </div>
  );
}

// ── Customer Card ─────────────────────────────────────────────────────────────
function CustomerCard({
  customer,
  highlightSerial,
  onCreateTicket,
}: {
  customer: typeof mockCustomers[number];
  highlightSerial?: string;
  onCreateTicket: () => void;
}) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Customer info */}
      <div className="p-4 bg-violet-50 border-b border-violet-100">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-violet-200 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-violet-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-violet-900">{customer.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Phone className="w-3 h-3 text-violet-600" />
              <p className="text-xs text-violet-700">+91 {customer.mobile}</p>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-violet-500" />
              <p className="text-[10px] text-violet-600">
                {customer.city} — {customer.pincode}
              </p>
            </div>
          </div>
          {customer.tickets.length > 0 && (
            <div className="flex items-center gap-1 bg-amber-100 border border-amber-200 rounded-lg px-2 py-1 flex-shrink-0">
              <AlertCircle className="w-3 h-3 text-amber-600" />
              <span className="text-[9px] font-bold text-amber-700">
                {customer.tickets.length} ticket{customer.tickets.length > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Purchases */}
      <div className="divide-y divide-border">
        {customer.purchases.map((p) => (
          <div
            key={p.id}
            className={`px-4 py-3 ${
              highlightSerial &&
              p.serialNumber.toLowerCase() === highlightSerial.toLowerCase()
                ? "bg-primary/5"
                : ""
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-foreground truncate">
                  {p.productName}
                </p>
                <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                  SN: {p.serialNumber}
                </p>
                <p className="text-[10px] text-muted-foreground">Order: {p.orderId.slice(0, 12)}…</p>
              </div>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0 ${
                  p.warrantyStatus === "Active"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                <ShieldCheck className="w-2.5 h-2.5" />
                {p.warrantyStatus}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create ticket CTA */}
      <div className="px-4 py-3 border-t border-border">
        <button
          onClick={onCreateTicket}
          className="w-full py-2.5 bg-violet-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-violet-700 active:scale-95 transition-all"
        >
          Create Ticket for this Customer
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HelpComplaintPage() {
  const [activeTab, setActiveTab] = useState<TabMode>("self");

  return (
    <div className="space-y-3 animate-fade-in pb-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/help" className="p-2 rounded-lg hover:bg-accent transition-colors flex-shrink-0">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-foreground">Create Complaint Ticket</h1>
          <p className="text-xs text-muted-foreground">Search and raise a complaint</p>
        </div>
        <span
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 border ${
            activeTab === "customer"
              ? "bg-violet-100 text-violet-700 border-violet-200"
              : "bg-blue-100 text-blue-700 border-blue-200"
          }`}
        >
          {activeTab === "customer" ? "👤 Customer" : "🏪 Self"}
        </span>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-muted rounded-xl p-1">
        {(["self", "customer"] as TabMode[]).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === t
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            {t === "self" ? "🏪 Self Complaint" : "👤 Customer Complaint"}
          </button>
        ))}
      </div>

      {/* Info banner */}
      <div
        className={`rounded-xl px-3 py-2.5 text-xs border ${
          activeTab === "self"
            ? "bg-blue-50 border-blue-200 text-blue-800"
            : "bg-violet-50 border-violet-200 text-violet-800"
        }`}
      >
        {activeTab === "self"
          ? "Search for an order item to raise a complaint about delivery, billing or product issues."
          : "Search for a customer by mobile or serial number to raise a complaint on their behalf."}
      </div>

      {/* Tab content */}
      {activeTab === "self" ? <SelfTab /> : <CustomerTab />}
    </div>
  );
}
