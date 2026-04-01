import { Link } from "react-router-dom";
import { mockOrders, type OrderItem } from "../lib/mockData";
import { Package, ChevronRight, Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { useState } from "react";

type Filters = {
  brand: string;
  productFamily: string;
  soStatus: string;
  orderStatus: string;
  dateFrom: string;
  dateTo: string;
};

const EMPTY_FILTERS: Filters = {
  brand: "", productFamily: "", soStatus: "", orderStatus: "", dateFrom: "", dateTo: "",
};

const FILTER_LABELS: Record<keyof Filters, string> = {
  brand: "Brand",
  productFamily: "Product Family",
  soStatus: "SO Status",
  orderStatus: "Order Status",
  dateFrom: "From Date",
  dateTo: "To Date",
};

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [draft, setDraft] = useState<Filters>(EMPTY_FILTERS);
  const [applied, setApplied] = useState<Filters>(EMPTY_FILTERS);

  const allItems = mockOrders.flatMap((o) => o.shipments.flatMap((s) => s.items));
  const brands = [...new Set(allItems.map((i) => i.brand))];
  const families = [...new Set(allItems.map((i) => i.productFamily))];

  const activeCount = Object.values(applied).filter(Boolean).length;

  const getItemSoStatus = (item: OrderItem) => {
    if (item.installationNotByUs) return "not_done_by_us";
    if (item.serviceOrder) return "so_created";
    return "pending";
  };

  const itemMatchesFilters = (item: OrderItem) => {
    if (applied.brand && item.brand !== applied.brand) return false;
    if (applied.productFamily && item.productFamily !== applied.productFamily) return false;
    if (applied.soStatus && applied.soStatus !== getItemSoStatus(item)) return false;
    return true;
  };

  const hasActiveFilters = Object.values(applied).some(Boolean);

  const filtered = mockOrders.filter((o) => {
    const searchMatch = !search || o.id.toLowerCase().includes(search.toLowerCase());
    if (!searchMatch) return false;
    if (applied.orderStatus && o.status !== applied.orderStatus) return false;
    if (applied.dateFrom && new Date(o.date) < new Date(applied.dateFrom)) return false;
    if (applied.dateTo && new Date(o.date) > new Date(applied.dateTo)) return false;
    if (!hasActiveFilters) return true;
    const itemFilters = applied.brand || applied.productFamily || applied.soStatus;
    if (!itemFilters) return true;
    return o.shipments.some((s) => s.items.some((i) => itemMatchesFilters(i)));
  });

  const getMatchingItemCount = (order: typeof mockOrders[0]) => {
    if (!hasActiveFilters) return null;
    let count = 0;
    order.shipments.forEach((s) => s.items.forEach((i) => { if (itemMatchesFilters(i)) count++; }));
    return count;
  };

  const openSheet = () => { setDraft({ ...applied }); setShowFilterSheet(true); };
  const applyFilters = () => { setApplied({ ...draft }); setShowFilterSheet(false); };
  const clearAll = () => { setDraft(EMPTY_FILTERS); };
  const removeChip = (key: keyof Filters) => setApplied(prev => ({ ...prev, [key]: "" }));

  const inputCls = "w-full px-3 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors";
  const labelCls = "block text-[11px] font-semibold text-muted-foreground mb-1.5";

  return (
    <div className="space-y-3 animate-fade-in">

      {/* Page Title */}
      <div>
        <h1 className="text-base font-bold text-foreground">My Sales Orders</h1>
        <p className="text-xs text-muted-foreground mt-0.5">B2B orders with item-level filtering</p>
      </div>

      {/* Search + Filter button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by Order ID or Shipment ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <button
          onClick={openSheet}
          className={`relative flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors flex-shrink-0 ${
            activeCount > 0
              ? "bg-primary text-white"
              : "bg-card border border-border text-foreground"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {activeCount > 0 && (
            <span className="w-4 h-4 bg-white/30 rounded-full flex items-center justify-center text-[9px] font-black">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 phone-scroll">
          {(Object.keys(applied) as (keyof Filters)[])
            .filter((k) => applied[k])
            .map((k) => (
              <div key={k} className="flex items-center gap-1 bg-primary/10 border border-primary/20 text-primary rounded-full px-2.5 py-1 flex-shrink-0">
                <span className="text-[10px] font-semibold">{FILTER_LABELS[k]}: {applied[k]}</span>
                <button onClick={() => removeChip(k)} className="ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          <button
            onClick={() => setApplied(EMPTY_FILTERS)}
            className="flex items-center gap-1 text-[10px] font-semibold text-destructive bg-destructive/10 border border-destructive/20 rounded-full px-2.5 py-1 flex-shrink-0"
          >
            <X className="w-3 h-3" /> Clear all
          </button>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-14">
            <Package className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">No orders found</p>
            <p className="text-xs text-muted-foreground mt-0.5">Try adjusting your search or filters</p>
          </div>
        ) : (
          filtered.map((order) => {
            const matchCount = getMatchingItemCount(order);
            return (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="flex items-center gap-3 bg-card rounded-xl border border-border p-3 active:bg-accent/10 transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground font-mono truncate">{order.id}</p>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                    </span>
                    <span className="text-[10px] text-muted-foreground">·</span>
                    <span className="text-[10px] text-muted-foreground">{order.items} items</span>
                    <span className="text-[10px] text-muted-foreground">·</span>
                    <span className="text-[10px] text-muted-foreground">{order.shipments.length} shipment{order.shipments.length > 1 ? "s" : ""}</span>
                    {matchCount !== null && (
                      <span className="text-[10px] font-semibold text-primary">· {matchCount} match{matchCount !== 1 ? "es" : ""}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                    order.status === "Delivered" ? "status-resolved" :
                    order.status === "In Transit" ? "status-in-progress" :
                    order.status === "Processing" ? "status-open" : "status-closed"
                  }`}>
                    {order.status}
                  </span>
                  <p className="text-xs font-bold text-foreground">₹{order.total.toLocaleString("en-IN")}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0" />
              </Link>
            );
          })
        )}
      </div>

      {/* ── Filter Bottom Sheet ───────────────────────────────────── */}
      {showFilterSheet && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowFilterSheet(false)}
          />

          {/* Sheet */}
          <div className="relative bg-card rounded-t-3xl shadow-2xl z-10 max-h-[82%] flex flex-col animate-fade-in">

            {/* Sheet handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 bg-border rounded-full" />
            </div>

            {/* Sheet header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
              <div>
                <h3 className="text-sm font-bold text-foreground">Filter Orders</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">Filter across all items in each order</p>
              </div>
              <button
                onClick={() => setShowFilterSheet(false)}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Filter fields — scrollable */}
            <div className="overflow-y-auto flex-1 px-4 py-4 space-y-4">

              {/* Order Status — full width */}
              <div>
                <label className={labelCls}>Order Status</label>
                <div className="relative">
                  <select
                    value={draft.orderStatus}
                    onChange={(e) => setDraft({ ...draft, orderStatus: e.target.value })}
                    className={inputCls + " appearance-none pr-7"}
                  >
                    <option value="">All Statuses</option>
                    <option value="Delivered">Delivered</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Processing">Processing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>From Date</label>
                  <input
                    type="date"
                    value={draft.dateFrom}
                    onChange={(e) => setDraft({ ...draft, dateFrom: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>To Date</label>
                  <input
                    type="date"
                    value={draft.dateTo}
                    onChange={(e) => setDraft({ ...draft, dateTo: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Row 1: Brand */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Brand</label>
                  <div className="relative">
                    <select
                      value={draft.brand}
                      onChange={(e) => setDraft({ ...draft, brand: e.target.value })}
                      className={inputCls + " appearance-none pr-7"}
                    >
                      <option value="">All Brands</option>
                      {brands.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Row 2: Product Family */}
                <div>
                  <label className={labelCls}>Product Family</label>
                  <div className="relative">
                    <select
                      value={draft.productFamily}
                      onChange={(e) => setDraft({ ...draft, productFamily: e.target.value })}
                      className={inputCls + " appearance-none pr-7"}
                    >
                      <option value="">All Families</option>
                      {families.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 3: SO Status */}
              <div>
                <label className={labelCls}>SO Status</label>
                <div className="relative">
                  <select
                    value={draft.soStatus}
                    onChange={(e) => setDraft({ ...draft, soStatus: e.target.value })}
                    className={inputCls + " appearance-none pr-7"}
                  >
                    <option value="">All</option>
                    <option value="so_created">SO Created</option>
                    <option value="not_done_by_us">Not Done by Us</option>
                    <option value="pending">Pending SO</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Sheet footer — actions */}
            <div className="flex items-center gap-3 px-4 py-4 border-t border-border flex-shrink-0">
              <button
                onClick={clearAll}
                className="flex-1 py-3 rounded-xl border border-border text-xs font-bold text-foreground bg-background active:bg-muted transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={applyFilters}
                className="flex-2 flex-grow-[2] py-3 rounded-xl bg-primary text-white text-xs font-bold active:opacity-90 transition-opacity"
              >
                Apply Filters {Object.values(draft).filter(Boolean).length > 0 && `(${Object.values(draft).filter(Boolean).length})`}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
