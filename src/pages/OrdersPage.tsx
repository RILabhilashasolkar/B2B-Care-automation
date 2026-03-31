import { Link } from "react-router-dom";
import { mockOrders, type OrderItem } from "../lib/mockData";
import { Package, ChevronRight, Search, Filter, X } from "lucide-react";
import { useState } from "react";

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ product: "", brand: "", productFamily: "", sku: "", serialNumber: "", soStatus: "", installStatus: "" });

  const allItems = mockOrders.flatMap((o) => o.shipments.flatMap((s) => s.items));
  const brands = [...new Set(allItems.map((i) => i.brand))];
  const families = [...new Set(allItems.map((i) => i.productFamily))];

  const hasActiveFilters = Object.values(filters).some(Boolean);

  const getItemSoStatus = (item: OrderItem) => {
    if (item.installationNotByUs) return "not_done_by_us";
    if (item.serviceOrder) return "so_created";
    return "pending";
  };

  const getItemInstallStatus = (item: OrderItem) => {
    if (item.installationNotByUs) return "not_by_us";
    if (item.installationRequested) return "requested";
    if (item.installationEligible) return "eligible";
    return "not_eligible";
  };

  const itemMatchesFilters = (item: OrderItem) => {
    if (filters.product && !item.name.toLowerCase().includes(filters.product.toLowerCase())) return false;
    if (filters.brand && item.brand !== filters.brand) return false;
    if (filters.productFamily && item.productFamily !== filters.productFamily) return false;
    if (filters.sku && !item.sku.toLowerCase().includes(filters.sku.toLowerCase())) return false;
    if (filters.serialNumber && !item.serialNumber.toLowerCase().includes(filters.serialNumber.toLowerCase())) return false;
    if (filters.soStatus && filters.soStatus !== getItemSoStatus(item)) return false;
    if (filters.installStatus && filters.installStatus !== getItemInstallStatus(item)) return false;
    return true;
  };

  const filtered = mockOrders.filter((o) => {
    const searchMatch = !search || o.id.toLowerCase().includes(search.toLowerCase());
    if (!searchMatch) return false;
    if (!hasActiveFilters) return true;
    return o.shipments.some((s) => s.items.some((item) => itemMatchesFilters(item)));
  });

  const getMatchingItemCount = (order: typeof mockOrders[0]) => {
    if (!hasActiveFilters) return null;
    let count = 0;
    order.shipments.forEach((s) => s.items.forEach((item) => { if (itemMatchesFilters(item)) count++; }));
    return count;
  };

  return (
    <div className="space-y-3 animate-fade-in">
      <div>
        <h1 className="text-base font-bold text-foreground">My Sales Orders</h1>
        <p className="text-xs text-muted-foreground mt-0.5">B2B orders with item-level filtering</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by Order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
            hasActiveFilters ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          {hasActiveFilters ? "Active" : "Filter"}
        </button>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-card rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-foreground">Filter across all items</p>
            <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-accent rounded-lg">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Product</label>
              <input value={filters.product} onChange={(e) => setFilters({ ...filters, product: e.target.value })} placeholder="Search product..." className="w-full px-2.5 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Brand</label>
              <select value={filters.brand} onChange={(e) => setFilters({ ...filters, brand: e.target.value })} className="w-full px-2.5 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">All</option>
                {brands.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Product Family</label>
              <select value={filters.productFamily} onChange={(e) => setFilters({ ...filters, productFamily: e.target.value })} className="w-full px-2.5 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">All</option>
                {families.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">SKU</label>
              <input value={filters.sku} onChange={(e) => setFilters({ ...filters, sku: e.target.value })} placeholder="Search SKU..." className="w-full px-2.5 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Serial Number</label>
              <input value={filters.serialNumber} onChange={(e) => setFilters({ ...filters, serialNumber: e.target.value })} placeholder="Search serial..." className="w-full px-2.5 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">SO Status</label>
              <select value={filters.soStatus} onChange={(e) => setFilters({ ...filters, soStatus: e.target.value })} className="w-full px-2.5 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">All</option>
                <option value="so_created">SO Created</option>
                <option value="not_done_by_us">SO Not Done by Us</option>
                <option value="pending">Pending SO Creation</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Installation</label>
              <select value={filters.installStatus} onChange={(e) => setFilters({ ...filters, installStatus: e.target.value })} className="w-full px-2.5 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">All</option>
                <option value="requested">Installation Requested</option>
                <option value="eligible">Pending Installation</option>
                <option value="not_by_us">Not Done by Us</option>
                <option value="not_eligible">Not Eligible</option>
              </select>
            </div>
          </div>
          {hasActiveFilters && (
            <button onClick={() => setFilters({ product: "", brand: "", productFamily: "", sku: "", serialNumber: "", soStatus: "", installStatus: "" })} className="text-xs text-primary hover:underline">
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No orders match your search or filters.</div>
        )}
        {filtered.map((order) => {
          const matchCount = getMatchingItemCount(order);
          return (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block bg-card rounded-xl border border-border p-3 active:bg-accent/10 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{order.id}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {order.items} items · {order.shipments.length} ship.
                      {matchCount !== null && <span className="ml-1 text-primary font-medium">({matchCount} match)</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
                    order.status === "Delivered" ? "status-resolved" :
                    order.status === "In Transit" ? "status-in-progress" :
                    order.status === "Processing" ? "status-open" : "status-closed"
                  }`}>
                    {order.status}
                  </span>
                  <p className="text-xs font-bold text-foreground">₹{order.total.toLocaleString("en-IN")}</p>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
