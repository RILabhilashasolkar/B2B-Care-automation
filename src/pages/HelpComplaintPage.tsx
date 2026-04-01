import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, Search, X, Package, Phone, ShieldCheck,
  AlertCircle, ChevronRight, Truck, User, MapPin,
  SlidersHorizontal, ChevronDown,
} from "lucide-react";
import {
  mockOrders, mockCustomers,
  type Order, type Shipment, type OrderItem,
} from "../lib/mockData";

type CustomerSearchMode = "mobile" | "serial";
type TabMode = "self" | "customer";

// ── Helpers ───────────────────────────────────────────────────────────────────
const shipmentStatusBadge = (status: string) =>
  status === "Delivered"
    ? "status-resolved"
    : "status-in-progress";

const orderStatusBadge = (status: string) =>
  status === "Delivered"  ? "status-resolved" :
  status === "Processing" ? "status-open"      :
  "status-in-progress";

// ── Self Tab — Filter types & constants ──────────────────────────────────────

interface SelfFilters {
  orderStatus: string;
  dateFrom: string;
  dateTo: string;
  brand: string;
  productFamily: string;
  productDetail: string;
}

const SELF_EMPTY_FILTERS: SelfFilters = {
  orderStatus: "", dateFrom: "", dateTo: "",
  brand: "", productFamily: "", productDetail: "",
};

const ORDER_STATUSES = ["Delivered", "In Transit", "Processing", "Out for Delivery"];

// Product detail options per brand → product family (cascading)
const COMPLAINT_DETAIL_MAP: Record<string, Record<string, string[]>> = {
  Samsung:   { Television:        ["Crystal UHD", "QLED", "4K", "Full HD"] },
  LG:        { "Air Conditioner": ["1 Ton", "1.5 Ton", "2 Ton", "Split AC", "Window AC", "Inverter AC"] },
  Whirlpool: { Refrigerator:      ["Single Door", "Double Door", "Frost Free", "Direct Cool"] },
  Havells:   { Fan:               ["Ceiling Fan", "Table Fan", "Wall Fan", "Exhaust Fan"] },
};

// ── Self Tab ──────────────────────────────────────────────────────────────────

// Pre-build a set of serial numbers already linked to a customer purchase
const _soldSerials = new Set(
  mockCustomers.flatMap((c) => c.purchases.map((p) => p.serialNumber.toLowerCase()))
);
/** Returns true if the item has been sold to / is linked to a customer */
const isItemSold = (item: OrderItem) =>
  !!item.customerMobile || _soldSerials.has(item.serialNumber.toLowerCase());

function SelfTab() {
  const navigate = useNavigate();
  const [query, setQuery] = useState<string>("");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [expandedShipmentId, setExpandedShipmentId] = useState<string | null>(null);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [draft, setDraft] = useState<SelfFilters>(SELF_EMPTY_FILTERS);
  const [applied, setApplied] = useState<SelfFilters>(SELF_EMPTY_FILTERS);

  const trimmed = query.trim().toLowerCase();

  // ── Derived filter options (cascading) ──────────────────────────────────────
  const allItems = mockOrders.flatMap((o) => o.shipments.flatMap((s) => s.items));
  const availableBrands = [...new Set(allItems.map((i) => i.brand))];
  const availableFamilies = [...new Set(
    (draft.brand ? allItems.filter((i) => i.brand === draft.brand) : allItems)
      .map((i) => i.productFamily)
  )];
  const availableDetails: string[] =
    draft.brand && draft.productFamily
      ? (COMPLAINT_DETAIL_MAP[draft.brand]?.[draft.productFamily] ?? [])
      : [];
  const showProductDetail = availableDetails.length > 0;

  // ── Active filter count ──────────────────────────────────────────────────────
  const activeFilterCount = [
    applied.orderStatus, applied.dateFrom, applied.dateTo,
    applied.brand, applied.productFamily, applied.productDetail,
  ].filter(Boolean).length;

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const itemMatchesFilters = (i: OrderItem) => {
    if (applied.brand && i.brand !== applied.brand) return false;
    if (applied.productFamily && i.productFamily !== applied.productFamily) return false;
    if (applied.productDetail) {
      const nl = i.name.toLowerCase();
      const dl = applied.productDetail.toLowerCase();
      const ok = applied.productDetail === "1 Ton"
        ? nl.includes("1 ton") && !nl.includes("1.5")
        : nl.includes(dl);
      if (!ok) return false;
    }
    return true;
  };

  // Helper: unsold items within a shipment matching both search + item-level filters
  const unsoldItems = (shipment: Shipment) =>
    shipment.items.filter(
      (i) =>
        !isItemSold(i) &&
        itemMatchesFilters(i) &&
        (trimmed.length < 3 ||
          i.serialNumber.toLowerCase().includes(trimmed) ||
          i.name.toLowerCase().includes(trimmed))
    );

  // Helper: shipments that have at least one qualifying unsold item
  const activeShipments = (order: Order) =>
    order.shipments.filter(
      (s) =>
        unsoldItems(s).length > 0 ||
        (trimmed.length >= 3 && s.id.toLowerCase().includes(trimmed))
    );

  // ── Filter orders ────────────────────────────────────────────────────────────
  const filteredOrders = mockOrders.filter((o) => {
    // Order status
    if (applied.orderStatus && o.status !== applied.orderStatus) return false;
    // Date range (order placed date)
    if (applied.dateFrom && new Date(o.date) < new Date(applied.dateFrom)) return false;
    if (applied.dateTo   && new Date(o.date) > new Date(applied.dateTo))   return false;
    // Text search
    if (trimmed.length >= 3) {
      const match = o.id.toLowerCase().includes(trimmed) ||
        o.shipments.some((s) => s.id.toLowerCase().includes(trimmed) || unsoldItems(s).length > 0);
      if (!match) return false;
    } else {
      if (!o.shipments.some((s) => unsoldItems(s).length > 0)) return false;
    }
    // Brand / family / detail filters (must have at least one matching item)
    if (applied.brand || applied.productFamily || applied.productDetail) {
      if (!o.shipments.some((s) => s.items.some((i) => itemMatchesFilters(i)))) return false;
    }
    return true;
  });

  const applyFilters = () => { setApplied(draft); setShowFilterSheet(false); };
  const clearFilters = () => { setDraft(SELF_EMPTY_FILTERS); setApplied(SELF_EMPTY_FILTERS); setShowFilterSheet(false); };

  const inputCls = "w-full px-3 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors";
  const labelCls = "block text-[11px] font-semibold text-muted-foreground mb-1.5";

  return (
    <div className="space-y-3">
      {/* Search + Filter row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Order ID, Shipment ID or Serial No."
            className="w-full pl-9 pr-9 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
        <button
          onClick={() => { setDraft(applied); setShowFilterSheet(true); }}
          className={`relative flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all flex-shrink-0 ${
            activeFilterCount > 0
              ? "bg-primary text-white border-primary"
              : "bg-card border-border text-foreground"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 bg-white/30 rounded-full flex items-center justify-center text-[9px] font-black">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {applied.orderStatus && (
            <button onClick={() => setApplied((p) => ({ ...p, orderStatus: "" }))}
              className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-[10px] font-semibold rounded-full">
              {applied.orderStatus} <X className="w-2.5 h-2.5" />
            </button>
          )}
          {applied.dateFrom && (
            <button onClick={() => setApplied((p) => ({ ...p, dateFrom: "" }))}
              className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-[10px] font-semibold rounded-full">
              From: {applied.dateFrom} <X className="w-2.5 h-2.5" />
            </button>
          )}
          {applied.dateTo && (
            <button onClick={() => setApplied((p) => ({ ...p, dateTo: "" }))}
              className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-[10px] font-semibold rounded-full">
              To: {applied.dateTo} <X className="w-2.5 h-2.5" />
            </button>
          )}
          {applied.brand && (
            <button onClick={() => setApplied((p) => ({ ...p, brand: "", productFamily: "", productDetail: "" }))}
              className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-[10px] font-semibold rounded-full">
              Brand: {applied.brand} <X className="w-2.5 h-2.5" />
            </button>
          )}
          {applied.productFamily && (
            <button onClick={() => setApplied((p) => ({ ...p, productFamily: "", productDetail: "" }))}
              className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-[10px] font-semibold rounded-full">
              {applied.productFamily} <X className="w-2.5 h-2.5" />
            </button>
          )}
          {applied.productDetail && (
            <button onClick={() => setApplied((p) => ({ ...p, productDetail: "" }))}
              className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-[10px] font-semibold rounded-full">
              {applied.productDetail} <X className="w-2.5 h-2.5" />
            </button>
          )}
          <button onClick={clearFilters} className="px-2 py-1 text-[10px] font-semibold text-muted-foreground underline">
            Clear All
          </button>
        </div>
      )}

      {/* Section label */}
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
        {trimmed.length >= 3 || activeFilterCount > 0
          ? `${filteredOrders.length} order${filteredOrders.length !== 1 ? "s" : ""} found`
          : "Recent Orders — tap to expand"}
      </p>

      {/* Empty state */}
      {filteredOrders.length === 0 && (
        <div className="flex flex-col items-center py-10 text-center">
          <Package className="w-10 h-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm font-semibold text-foreground">No orders found</p>
          <p className="text-xs text-muted-foreground mt-1">
            Try adjusting your search or filters
          </p>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="mt-3 text-xs text-primary font-semibold underline">
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* ── Filter Sheet ── */}
      {showFilterSheet && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilterSheet(false)} />
          <div className="relative bg-card rounded-t-3xl shadow-2xl z-10 max-h-[85%] flex flex-col">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-border rounded-full" />
            </div>
            {/* Header */}
            <div className="flex items-start justify-between px-5 py-3 border-b border-border">
              <div>
                <p className="text-sm font-bold text-foreground">Filter Orders</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Filter across all items in each order</p>
              </div>
              <button onClick={() => setShowFilterSheet(false)} className="p-1.5 rounded-full bg-muted hover:bg-accent transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {/* Order Status */}
              <div>
                <label className={labelCls}>Order Status</label>
                <div className="relative">
                  <select
                    value={draft.orderStatus}
                    onChange={(e) => setDraft({ ...draft, orderStatus: e.target.value })}
                    className={inputCls + " appearance-none pr-7"}
                  >
                    <option value="">All Statuses</option>
                    {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              {/* Date range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>From Date</label>
                  <input type="date" value={draft.dateFrom}
                    onChange={(e) => setDraft({ ...draft, dateFrom: e.target.value })}
                    className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>To Date</label>
                  <input type="date" value={draft.dateTo}
                    onChange={(e) => setDraft({ ...draft, dateTo: e.target.value })}
                    className={inputCls} />
                </div>
              </div>
              {/* Brand */}
              <div>
                <label className={labelCls}>Brand</label>
                <div className="relative">
                  <select
                    value={draft.brand}
                    onChange={(e) => setDraft({ ...draft, brand: e.target.value, productFamily: "", productDetail: "" })}
                    className={inputCls + " appearance-none pr-7"}
                  >
                    <option value="">All Brands</option>
                    {availableBrands.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              {/* Product Family (depends on brand) */}
              <div>
                <label className={labelCls}>
                  Product Family
                  {draft.brand && <span className="ml-1 font-normal text-primary/70">({draft.brand})</span>}
                </label>
                <div className="relative">
                  <select
                    value={draft.productFamily}
                    onChange={(e) => setDraft({ ...draft, productFamily: e.target.value, productDetail: "" })}
                    className={inputCls + " appearance-none pr-7"}
                  >
                    <option value="">All Families</option>
                    {availableFamilies.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              {/* Product Details (depends on brand + family) */}
              {showProductDetail && (
                <div>
                  <label className={labelCls}>
                    Product Details
                    {draft.productFamily && <span className="ml-1 font-normal text-primary/70">({draft.productFamily})</span>}
                  </label>
                  <div className="relative">
                    <select
                      value={draft.productDetail}
                      onChange={(e) => setDraft({ ...draft, productDetail: e.target.value })}
                      className={inputCls + " appearance-none pr-7"}
                    >
                      <option value="">All Details</option>
                      {availableDetails.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              )}
            </div>
            {/* Footer */}
            <div className="flex items-center gap-3 px-5 py-4 border-t border-border flex-shrink-0">
              <button
                onClick={() => setDraft(SELF_EMPTY_FILTERS)}
                className="flex-1 py-3 rounded-xl border border-border text-xs font-bold text-foreground bg-background active:bg-muted transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={applyFilters}
                className="flex-2 flex-grow-[2] py-3 rounded-xl bg-primary text-white text-xs font-bold active:opacity-90 transition-opacity"
              >
                Apply Filters
                {[draft.orderStatus, draft.dateFrom, draft.dateTo, draft.brand, draft.productFamily, draft.productDetail].filter(Boolean).length > 0
                  ? ` (${[draft.orderStatus, draft.dateFrom, draft.dateTo, draft.brand, draft.productFamily, draft.productDetail].filter(Boolean).length})`
                  : ""}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders list */}
      <div className="space-y-2">
        {filteredOrders.map((order) => {
          const isOrderExpanded = expandedOrderId === order.id;
          const visibleShipments = activeShipments(order);
          const totalItems = visibleShipments.reduce((n, s) => n + unsoldItems(s).length, 0);

          return (
            <div key={order.id} className="bg-card border border-border rounded-xl overflow-hidden">
              {/* Order header row */}
              <button
                onClick={() => {
                  setExpandedOrderId(isOrderExpanded ? null : order.id);
                  setExpandedShipmentId(null);
                }}
                className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-accent/40 transition-colors"
              >
                <Package className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold font-mono">{order.id}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {totalItems} item{totalItems !== 1 ? "s" : ""} ·{" "}
                    {new Date(order.date).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "2-digit",
                    })}
                  </p>
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${orderStatusBadge(order.status)}`}>
                  {order.status}
                </span>
                <ChevronRight
                  className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                    isOrderExpanded ? "rotate-90" : ""
                  }`}
                />
              </button>

              {isOrderExpanded && (
                <div className="border-t border-border">
                  {/* Order-level ticket CTA */}
                  <button
                    onClick={() => navigate(`/ticket/create?orderId=${order.id}&level=order&source=help`)}
                    className="w-full text-left px-4 py-2.5 bg-orange-50 hover:bg-orange-100 flex items-center justify-between gap-2 transition-colors"
                  >
                    <span className="text-xs font-semibold text-orange-800">
                      Create Ticket for this Order
                    </span>
                    <span className="text-[9px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200 flex-shrink-0">
                      Billing · Order Issues
                    </span>
                  </button>

                  {/* Shipments */}
                  {visibleShipments.map((shipment) => {
                    const isShipmentExpanded = expandedShipmentId === shipment.id;
                    const itemsToShow = unsoldItems(shipment);
                    return (
                      <div key={shipment.id} className="border-t border-border/60">
                        {/* Shipment row */}
                        <button
                          onClick={() =>
                            setExpandedShipmentId(isShipmentExpanded ? null : shipment.id)
                          }
                          className="w-full text-left px-4 py-2.5 flex items-center gap-2 bg-muted/30 hover:bg-muted/60 transition-colors"
                        >
                          <Truck className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-mono font-semibold">{shipment.id}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {itemsToShow.length} unsold item{itemsToShow.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${shipmentStatusBadge(shipment.status)}`}>
                            {shipment.status}
                          </span>
                          <ChevronRight
                            className={`w-3.5 h-3.5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                              isShipmentExpanded ? "rotate-90" : ""
                            }`}
                          />
                        </button>

                        {isShipmentExpanded && (
                          <div className="border-t border-border/40">
                            {/* Shipment-level ticket CTA */}
                            <button
                              onClick={() =>
                                navigate(
                                  `/ticket/create?orderId=${order.id}&shipmentId=${shipment.id}&level=shipment&source=help`
                                )
                              }
                              className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 flex items-center justify-between gap-2 transition-colors"
                            >
                              <span className="text-xs font-semibold text-blue-800">
                                Create Ticket for this Shipment
                              </span>
                              <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200 flex-shrink-0">
                                Delivery Issues
                              </span>
                            </button>

                            {/* Unsold items only */}
                            {itemsToShow.map((item) => (
                              <button
                                key={item.id}
                                onClick={() =>
                                  navigate(
                                    `/ticket/create?orderId=${order.id}&itemId=${item.id}&shipmentId=${shipment.id}&source=help`
                                  )
                                }
                                className="w-full text-left px-4 py-2.5 border-t border-border/40 flex items-center gap-3 hover:bg-accent/30 transition-colors"
                              >
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <Package className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[11px] font-semibold truncate">{item.name}</p>
                                  <p className="text-[10px] font-mono text-muted-foreground">
                                    SN: {item.serialNumber}
                                  </p>
                                </div>
                                <span className="text-[9px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
                                  {item.brand}
                                </span>
                                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
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

      {/* Results / empty states */}
      {!ready ? null : !hasResults ? (
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
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabMode>(
    searchParams.get("tab") === "customer" ? "customer" : "self"
  );

  return (
    <div className="space-y-3 animate-fade-in pb-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/help" className="p-2 rounded-lg hover:bg-accent transition-colors flex-shrink-0">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-foreground">Create Complaint Ticket</h1>
          <p className="text-xs text-muted-foreground">Browse orders and raise a complaint</p>
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

      {/* Tab content */}
      {activeTab === "self" ? <SelfTab /> : <CustomerTab />}
    </div>
  );
}
