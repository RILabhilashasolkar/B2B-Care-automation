import { useParams, Link, useNavigate } from "react-router-dom";
import { mockOrders, mockCustomers, type OrderItem, type ServiceOrderStatus } from "../lib/mockData";
import { ArrowLeft, Package, ChevronRight, Truck, MessageCircle, Wrench, X, Search, User, Phone, MapPin, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const statusColor: Record<ServiceOrderStatus, string> = {
  "Open": "status-open",
  "Engineer Visit Pending": "status-in-progress",
  "Engineer On the Way": "bg-accent/20 text-accent-foreground",
  "Closed": "status-resolved",
};

interface InstallFormData {
  customerName: string;
  mobile: string;
  address: string;
  city: string;
  pincode: string;
  preferredDate: string;
  notes: string;
}

function CreateInstallationModal({ item, orderId, onClose, onSubmit }: { item: OrderItem; orderId: string; onClose: () => void; onSubmit: (data: InstallFormData) => void }) {
  const [form, setForm] = useState<InstallFormData>({
    customerName: "", mobile: "", address: "", city: "", pincode: "", preferredDate: "", notes: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      setError("Enter a valid 10-digit Indian mobile number");
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">Create Installation Request</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        {/* Auto-filled product info */}
        <div className="bg-accent/50 rounded-lg p-3 mb-5">
          <p className="text-[10px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Product Details (Auto-filled)</p>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <div><span className="text-muted-foreground">Product:</span> <span className="text-foreground font-medium">{item.name}</span></div>
            <div><span className="text-muted-foreground">Serial:</span> <span className="text-foreground font-medium">{item.serialNumber}</span></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Customer Name *</label>
              <input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Full name" />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Mobile Number *</label>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">+91</span>
                <input required value={form.mobile} onChange={(e) => { setForm({ ...form, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) }); setError(""); }} className="flex-1 px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="10-digit mobile" />
              </div>
              {error && <p className="text-xs text-destructive mt-1">{error}</p>}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Installation Address *</label>
            <textarea required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" rows={2} placeholder="Full installation address" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">City *</label>
              <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="City" />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Pincode *</label>
              <input required pattern="[0-9]{6}" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="6-digit" />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Preferred Date</label>
              <input type="date" value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Additional Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" rows={2} placeholder="Floor, landmark, special instructions..." />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
              <Wrench className="w-4 h-4" /> Create Installation Request
            </button>
            <button type="button" onClick={onClose} className="px-5 py-2.5 bg-card border border-border text-foreground rounded-lg text-sm font-medium hover:bg-accent">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Customer Lookup for Delivered Shipments ─────────────────────────────────
type SearchMode = "mobile" | "serial";

function CustomerLookup() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<SearchMode>("mobile");
  const [query, setQuery] = useState("");

  const trimmed = query.trim().toLowerCase();

  const result = trimmed.length >= 4
    ? mockCustomers.find((c) =>
        mode === "mobile"
          ? c.mobile.includes(trimmed)
          : c.purchases.some((p) => p.serialNumber.toLowerCase().includes(trimmed))
      )
    : null;

  const noResult = trimmed.length >= 4 && !result;

  const matchedPurchases = result
    ? (mode === "serial"
        ? result.purchases.filter((p) => p.serialNumber.toLowerCase().includes(trimmed))
        : result.purchases)
    : [];

  return (
    <div className="mx-4 mb-4 border border-border rounded-xl overflow-hidden">
      {/* Header / toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-accent/40 text-left"
      >
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-foreground">Find Customer for Delivered Item</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {open && (
        <div className="p-4 space-y-3 bg-card">
          {/* Mode toggle */}
          <div className="flex bg-muted rounded-lg p-0.5 gap-0.5">
            {(["mobile", "serial"] as SearchMode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setQuery(""); }}
                className={`flex-1 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${
                  mode === m ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
                }`}
              >
                {m === "mobile" ? "📱 Mobile Number" : "🔢 Serial Number"}
              </button>
            ))}
          </div>

          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type={mode === "mobile" ? "tel" : "text"}
              inputMode={mode === "mobile" ? "numeric" : "text"}
              placeholder={mode === "mobile" ? "Enter customer mobile number" : "Enter product serial number"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Result */}
          {result && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">{result.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Phone className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">+91 {result.mobile}</span>
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 bg-emerald-600 text-white rounded-full font-bold flex-shrink-0">Found</span>
              </div>

              <div className="flex items-start gap-1.5">
                <MapPin className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-muted-foreground">{result.address}, {result.city} — {result.pincode}</p>
              </div>

              {matchedPurchases.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {mode === "serial" ? "Matched Purchase" : "All Purchases"}
                  </p>
                  {matchedPurchases.map((p) => (
                    <div key={p.id} className="bg-white rounded-lg px-3 py-2 flex items-center justify-between gap-2 border border-emerald-100">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{p.productName}</p>
                        <p className="text-[10px] text-muted-foreground">SN: {p.serialNumber}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          p.warrantyStatus === "Active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {p.warrantyStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {result.tickets.length > 0 && (
                <p className="text-[10px] text-amber-700 bg-amber-50 rounded-lg px-2.5 py-1.5 border border-amber-200">
                  ⚠️ {result.tickets.length} existing ticket{result.tickets.length > 1 ? "s" : ""} for this customer
                </p>
              )}
            </div>
          )}

          {noResult && (
            <div className="text-center py-4">
              <User className="w-7 h-7 text-muted-foreground/30 mx-auto mb-1.5" />
              <p className="text-xs font-semibold text-foreground">No customer found</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {mode === "mobile" ? "No customer registered with this mobile" : "No purchase found for this serial number"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const order = mockOrders.find((o) => o.id === orderId);
  const [installItem, setInstallItem] = useState<OrderItem | null>(null);
  const [installRequests, setInstallRequests] = useState<Record<string, { customerName: string; mobile: string }>>({});
  const navigate = useNavigate();

  if (!order) return <div className="text-center py-20 text-muted-foreground">Order not found</div>;

  const handleInstallRequest = (itemId: string, data: InstallFormData) => {
    setInstallRequests((prev) => ({ ...prev, [itemId]: { customerName: data.customerName, mobile: data.mobile } }));
    setInstallItem(null);
    alert(`✅ Installation request created for ${data.customerName} (+91${data.mobile}). Ticket: TKT-INST-${Date.now().toString().slice(-4)}`);
  };

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to="/orders" className="p-2 rounded-lg hover:bg-accent transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-base font-bold text-foreground">{order.id}</h1>
          <p className="text-sm text-muted-foreground">
            Placed on {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-medium ${
          order.status === "Delivered" ? "status-resolved" : "status-in-progress"
        }`}>
          {order.status}
        </span>
      </div>

      {/* Order Summary */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Total Amount</p>
            <p className="font-semibold text-foreground">₹{order.total.toLocaleString("en-IN")}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Items</p>
            <p className="font-semibold text-foreground">{order.items}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Shipments</p>
            <p className="font-semibold text-foreground">{order.shipments.length}</p>
          </div>
        </div>
      </div>

      {/* Shipments with Unified View */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-foreground">Shipments</h2>
        {order.shipments.map((shipment) => (
          <div key={shipment.id} className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{shipment.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {shipment.status === "Delivered" ? "Delivered on" : "Expected by"}{" "}
                    {new Date(shipment.deliveryDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </p>
                </div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                shipment.status === "Delivered" ? "status-resolved" : "status-in-progress"
              }`}>
                {shipment.status}
              </span>
            </div>
            <div className="divide-y divide-border">
              {shipment.items.map((item) => {
                const isInstallCreated = installRequests[item.id] || item.installationRequested;
                const so = item.serviceOrder;

                return (
                  <div key={item.id} className="px-5 py-4 space-y-3">
                    {/* Item row */}
                    <Link
                      to={`/orders/${order.id}/item/${item.id}`}
                      className="flex items-center justify-between hover:opacity-80 transition-opacity group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            SKU: {item.sku} · SN: {item.serialNumber} · Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-semibold text-foreground">₹{item.price.toLocaleString("en-IN")}</p>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      </div>
                    </Link>

                    {/* Unified consolidated view */}
                    <div className="ml-16 space-y-2">
                      {/* Tags row */}
                      <div className="flex flex-wrap gap-2">
                        {item.installationEligible && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            isInstallCreated ? "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]" : "bg-[hsl(var(--info))]/10 text-[hsl(var(--info))]"
                          }`}>
                            {isInstallCreated ? "✓ Installation Requested" : "Installation Eligible"}
                          </span>
                        )}
                        {(item.installationNotByUs) && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-muted text-muted-foreground">
                            Installation: Not by JMD
                          </span>
                        )}
                        {so && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor[so.status]}`}>
                            SO: {so.id} — {so.status}
                          </span>
                        )}
                      </div>

                      {/* Install request info */}
                      {installRequests[item.id] && (
                        <p className="text-xs text-muted-foreground">
                          🔧 Install for: {installRequests[item.id].customerName} · +91{installRequests[item.id].mobile}
                        </p>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2">
                        {shipment.status === "Delivered" && !isInstallCreated && (
                          <button
                            onClick={() => setInstallItem(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors"
                          >
                            <Wrench className="w-3.5 h-3.5" /> Create SO
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/service/self/create?orderId=${order.id}`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-foreground border border-border rounded-lg text-xs font-medium hover:bg-accent/80 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> Raise Ticket
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Customer lookup — delivered shipments only */}
            {shipment.status === "Delivered" && <CustomerLookup />}
          </div>
        ))}
      </div>

      {/* Modal */}
      {installItem && (
        <CreateInstallationModal
          item={installItem}
          orderId={order.id}
          onClose={() => setInstallItem(null)}
          onSubmit={(data) => handleInstallRequest(installItem.id, data)}
        />
      )}
    </div>
  );
}
