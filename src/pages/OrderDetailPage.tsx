import { useParams, Link } from "react-router-dom";
import { mockOrders, type OrderItem, type ServiceOrderStatus } from "../lib/mockData";
import { ArrowLeft, Package, ChevronRight, Truck, MessageCircle, Phone, Ban, Wrench, X } from "lucide-react";
import { useState } from "react";

const statusColor: Record<ServiceOrderStatus, string> = {
  "Open": "status-open",
  "Engineer Visit Pending": "status-in-progress",
  "Engineer On the Way": "bg-accent/20 text-accent-foreground",
  "Closed": "status-resolved",
};

function SendServiceLinkModal({ item, onClose, onSubmit }: { item: OrderItem; onClose: () => void; onSubmit: (mobile: string) => void }) {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter a valid 10-digit Indian mobile number");
      return;
    }
    onSubmit(mobile);
  };

  return (
    <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">Send Service Link</h3>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Send a WhatsApp/SMS link to the customer so they can create a service order for <strong>{item.name}</strong>.
        </p>
        <div className="mb-1">
          <label className="block text-sm font-medium text-foreground mb-1.5">Customer Mobile Number *</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-medium">+91</span>
            <input
              value={mobile}
              onChange={(e) => { setMobile(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
              className="flex-1 px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter 10-digit mobile"
            />
          </div>
          {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={handleSubmit} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[hsl(var(--success))] text-white rounded-lg text-sm font-medium hover:opacity-90">
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </button>
          <button onClick={handleSubmit} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
            <Phone className="w-4 h-4" /> SMS
          </button>
        </div>
      </div>
    </div>
  );
}

function NotDoneByUsModal({ item, onClose, onSubmit }: { item: OrderItem; onClose: () => void; onSubmit: (mobile: string) => void }) {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter a valid 10-digit Indian mobile number");
      return;
    }
    onSubmit(mobile);
  };

  return (
    <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">Installation Not Done by Us</h3>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Tag <strong>{item.name}</strong> as "Installation Not Done by Us". Please provide the customer's mobile number for records.
        </p>
        <div className="mb-1">
          <label className="block text-sm font-medium text-foreground mb-1.5">Customer Mobile Number *</label>
          <input
            value={mobile}
            onChange={(e) => { setMobile(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
            className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter 10-digit mobile"
          />
          {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={handleSubmit} className="flex-1 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:opacity-90">
            Confirm & Tag
          </button>
          <button onClick={onClose} className="px-4 py-2.5 bg-card border border-border text-foreground rounded-lg text-sm font-medium hover:bg-accent">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

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
            <p className="text-xs text-muted-foreground mt-0.5">This creates a service order and links the customer for future service</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        {/* Auto-filled product info */}
        <div className="bg-accent/50 rounded-lg p-3 mb-5">
          <p className="text-[10px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Product Details (Auto-filled)</p>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <div><span className="text-muted-foreground">Product:</span> <span className="text-foreground font-medium">{item.name}</span></div>
            <div><span className="text-muted-foreground">SKU:</span> <span className="text-foreground font-medium">{item.sku}</span></div>
            <div><span className="text-muted-foreground">Serial:</span> <span className="text-foreground font-medium">{item.serialNumber}</span></div>
            <div><span className="text-muted-foreground">Order:</span> <span className="text-foreground font-medium">{orderId}</span></div>
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

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const order = mockOrders.find((o) => o.id === orderId);
  const [serviceLinkItem, setServiceLinkItem] = useState<OrderItem | null>(null);
  const [notDoneItem, setNotDoneItem] = useState<OrderItem | null>(null);
  const [installItem, setInstallItem] = useState<OrderItem | null>(null);
  const [sentLinks, setSentLinks] = useState<Record<string, string>>({});
  const [notDoneByUs, setNotDoneByUs] = useState<Record<string, string>>({});
  const [installRequests, setInstallRequests] = useState<Record<string, { customerName: string; mobile: string }>>({});

  if (!order) return <div className="text-center py-20 text-muted-foreground">Order not found</div>;

  const handleSendLink = (itemId: string, mobile: string) => {
    setSentLinks((prev) => ({ ...prev, [itemId]: mobile }));
    setServiceLinkItem(null);
    alert(`✅ Service link sent via WhatsApp/SMS to +91${mobile}`);
  };

  const handleNotDoneByUs = (itemId: string, mobile: string) => {
    setNotDoneByUs((prev) => ({ ...prev, [itemId]: mobile }));
    setNotDoneItem(null);
    alert(`Tagged as "Installation Not Done by Us" for +91${mobile}`);
  };

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
                const linkSent = sentLinks[item.id] || item.customerMobile;
                const isNotDone = notDoneByUs[item.id] || item.installationNotByUs;
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
                        {isNotDone && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-destructive/10 text-destructive">
                            <Ban className="w-3 h-3 inline mr-0.5" /> Not Done by Us
                          </span>
                        )}
                        {so && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor[so.status]}`}>
                            SO: {so.id} — {so.status}
                          </span>
                        )}
                      </div>

                      {/* Customer mobile & install info */}
                      {linkSent && (
                        <p className="text-xs text-muted-foreground">
                          📱 Customer: +91{typeof linkSent === "string" ? linkSent : sentLinks[item.id]}
                        </p>
                      )}
                      {installRequests[item.id] && (
                        <p className="text-xs text-muted-foreground">
                          🔧 Install for: {installRequests[item.id].customerName} · +91{installRequests[item.id].mobile}
                        </p>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2">
                        {!linkSent && !isNotDone && (
                          <button
                            onClick={() => setServiceLinkItem(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border border-[hsl(var(--success))]/20 rounded-lg text-xs font-medium hover:bg-[hsl(var(--success))]/20 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> Send Service Link
                          </button>
                        )}
                        {item.installationEligible && !isInstallCreated && !isNotDone && (
                          <button
                            onClick={() => setInstallItem(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors"
                          >
                            <Wrench className="w-3.5 h-3.5" /> Create Installation
                          </button>
                        )}
                        {!isNotDone && !isInstallCreated && (
                          <button
                            onClick={() => setNotDoneItem(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-xs font-medium hover:bg-destructive/20 transition-colors"
                          >
                            <Ban className="w-3.5 h-3.5" /> Not Done by Us
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {serviceLinkItem && (
        <SendServiceLinkModal
          item={serviceLinkItem}
          onClose={() => setServiceLinkItem(null)}
          onSubmit={(mobile) => handleSendLink(serviceLinkItem.id, mobile)}
        />
      )}
      {notDoneItem && (
        <NotDoneByUsModal
          item={notDoneItem}
          onClose={() => setNotDoneItem(null)}
          onSubmit={(mobile) => handleNotDoneByUs(notDoneItem.id, mobile)}
        />
      )}
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
