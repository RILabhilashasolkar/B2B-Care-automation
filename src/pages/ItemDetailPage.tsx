import { useParams, Link, useNavigate } from "react-router-dom";
import { mockOrders, type ServiceOrderStatus } from "../lib/mockData";
import { ArrowLeft, Package, Wrench, Ticket, MessageCircle, Phone, Ban, X } from "lucide-react";
import { useState } from "react";

const statusColor: Record<ServiceOrderStatus, string> = {
  "Open": "status-open",
  "Engineer Visit Pending": "status-in-progress",
  "Engineer On the Way": "bg-accent/20 text-accent-foreground",
  "Closed": "status-resolved",
};

const statusSteps: ServiceOrderStatus[] = ["Open", "Engineer Visit Pending", "Engineer On the Way", "Closed"];

export default function ItemDetailPage() {
  const { orderId, itemId } = useParams();
  const navigate = useNavigate();
  const order    = mockOrders.find((o) => o.id === orderId);
  const shipment = order?.shipments.find((s) => s.items.some((i) => i.id === itemId));
  const item     = shipment?.items.find((i) => i.id === itemId);
  const [showInstallForm, setShowInstallForm] = useState(false);
  const [showServiceLink, setShowServiceLink] = useState(false);
  const [showNotDone, setShowNotDone] = useState(false);
  const [serviceMobile, setServiceMobile] = useState("");
  const [serviceMobileError, setServiceMobileError] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const [notDoneTagged, setNotDoneTagged] = useState(false);
  const [installForm, setInstallForm] = useState({
    customerName: "", mobile: "", address: "", city: "", pincode: "", notes: "",
  });

  if (!order || !item) return <div className="text-center py-20 text-muted-foreground">Item not found</div>;

  const so = item.serviceOrder;

  const handleInstallSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Installation request submitted successfully! Ticket ID: TKT-C-NEW-001");
    setShowInstallForm(false);
  };

  const validateMobile = (m: string) => /^[6-9]\d{9}$/.test(m);

  const handleSendLink = () => {
    if (!validateMobile(serviceMobile)) {
      setServiceMobileError("Enter a valid 10-digit Indian mobile number");
      return;
    }
    setLinkSent(true);
    setShowServiceLink(false);
    alert(`✅ Service link sent via WhatsApp/SMS to +91${serviceMobile}`);
  };

  const handleNotDone = () => {
    if (!validateMobile(serviceMobile)) {
      setServiceMobileError("Enter a valid 10-digit Indian mobile number");
      return;
    }
    setNotDoneTagged(true);
    setShowNotDone(false);
    alert(`Tagged as "Installation Not Done by Us" for +91${serviceMobile}`);
  };

  return (
    <div className="space-y-3 animate-fade-in max-w-3xl">
      <div className="flex items-center gap-3">
        <Link to={`/orders/${orderId}`} className="p-2 rounded-lg hover:bg-accent transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-base font-bold text-foreground">Item Details</h1>
          <p className="text-xs text-muted-foreground">{orderId}</p>
        </div>
      </div>

      {/* Product Card */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
            <Package className="w-7 h-7 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-foreground">{item.name}</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mt-2 text-xs">
              <div><span className="text-muted-foreground">SKU:</span> <span className="font-medium text-foreground">{item.sku}</span></div>
              <div><span className="text-muted-foreground">Serial No:</span> <span className="font-medium text-foreground">{item.serialNumber}</span></div>
              <div><span className="text-muted-foreground">Category:</span> <span className="font-medium text-foreground">{item.category}</span></div>
              <div><span className="text-muted-foreground">Quantity:</span> <span className="font-medium text-foreground">{item.quantity}</span></div>
              <div><span className="text-muted-foreground">Unit Price:</span> <span className="font-medium text-foreground">₹{item.price.toLocaleString("en-IN")}</span></div>
              <div><span className="text-muted-foreground">Total:</span> <span className="font-medium text-foreground">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Order Status */}
      {so && (
        <div className="bg-card rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Service Order</p>
              <p className="text-sm font-bold text-foreground">{so.id}</p>
            </div>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${statusColor[so.status]}`}>
              {so.status}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {statusSteps.map((step, i) => {
              const currentIndex = statusSteps.indexOf(so.status);
              const isCompleted = i <= currentIndex;
              return (
                <div key={step} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className={`h-1.5 w-full rounded-full ${isCompleted ? "bg-primary" : "bg-border"}`} />
                  <span className={`text-[10px] text-center ${isCompleted ? "text-primary font-medium" : "text-muted-foreground"}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-muted-foreground">📱 Customer: +91{so.customerMobile} · Updated: {new Date(so.updatedAt).toLocaleDateString("en-IN")}</p>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {(item.installationNotByUs || notDoneTagged) && (
          <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full font-semibold bg-destructive/10 text-destructive">
            <Ban className="w-3 h-3" /> Not Done by Us
          </span>
        )}
        {linkSent && !so && (
          <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]">
            ✓ Service Link Sent (+91{serviceMobile})
          </span>
        )}
        {/* Customer mobile only visible after installation/service/tagging */}
        {item.customerMobile && (item.installationRequested || !!so || item.installationNotByUs || notDoneTagged) && (
          <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold bg-[hsl(var(--info))]/10 text-[hsl(var(--info))]">
            📱 +91{item.customerMobile}
          </span>
        )}
      </div>

      {/* Action Buttons — only when shipment is Delivered */}
      {shipment?.status === "Delivered" ? (
        <div className="space-y-1.5">
          {item.installationEligible && !item.installationRequested && (
            <button
              onClick={() => setShowInstallForm(true)}
              className="w-full flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Wrench className="w-3.5 h-3.5" />
              Raise Installation Request
            </button>
          )}
          {item.installationRequested && (
            <span className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] rounded-xl text-xs font-semibold">
              ✓ Installation Already Requested
            </span>
          )}
          {!linkSent && !item.customerMobile && (
            <button
              onClick={() => setShowServiceLink(true)}
              className="w-full flex items-center gap-2 px-4 py-2 bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border border-[hsl(var(--success))]/20 rounded-xl text-xs font-semibold hover:bg-[hsl(var(--success))]/20 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Send Service Link
            </button>
          )}
          <div className="flex gap-1.5">
            {!notDoneTagged && !item.installationNotByUs && !item.installationRequested && (
              <button
                onClick={() => setShowNotDone(true)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl text-xs font-semibold hover:bg-destructive/20 transition-colors"
              >
                <Ban className="w-3.5 h-3.5" />
                Not Done by Us
              </button>
            )}
            <button
              onClick={() => navigate(`/ticket/create?orderId=${orderId}&itemId=${itemId}&shipmentId=${shipment?.id ?? ""}`)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-card border border-border text-foreground rounded-xl text-xs font-semibold hover:bg-accent transition-colors"
            >
              <Ticket className="w-3.5 h-3.5" />
              Create Ticket
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-muted/50 rounded-xl border border-border px-4 py-3">
          <p className="text-xs text-muted-foreground text-center">Item actions will be available after delivery</p>
        </div>
      )}

      {/* Send Service Link Modal */}
      {showServiceLink && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowServiceLink(false)}>
          <div className="bg-card rounded-2xl border border-border p-5 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground">Send Service Link</h3>
              <button onClick={() => setShowServiceLink(false)} className="p-1 hover:bg-accent rounded-lg"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Send a WhatsApp/SMS link to the customer for self-service order creation.</p>
            <div className="mb-1">
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Customer Mobile Number *</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">+91</span>
                <input
                  value={serviceMobile}
                  onChange={(e) => { setServiceMobile(e.target.value.replace(/\D/g, "").slice(0, 10)); setServiceMobileError(""); }}
                  className="flex-1 px-3 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="10-digit mobile"
                />
              </div>
              {serviceMobileError && <p className="text-xs text-destructive mt-1">{serviceMobileError}</p>}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleSendLink} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[hsl(var(--success))] text-white rounded-xl text-xs font-bold hover:opacity-90">
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
              </button>
              <button onClick={handleSendLink} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:opacity-90">
                <Phone className="w-3.5 h-3.5" /> SMS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Not Done By Us Modal */}
      {showNotDone && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowNotDone(false)}>
          <div className="bg-card rounded-2xl border border-border p-5 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground">Installation Not Done by Us</h3>
              <button onClick={() => setShowNotDone(false)} className="p-1 hover:bg-accent rounded-lg"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Tag this item as "Installation Not Done by Us" and capture customer mobile.</p>
            <div className="mb-1">
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Customer Mobile Number *</label>
              <input
                value={serviceMobile}
                onChange={(e) => { setServiceMobile(e.target.value.replace(/\D/g, "").slice(0, 10)); setServiceMobileError(""); }}
                className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="10-digit mobile"
              />
              {serviceMobileError && <p className="text-xs text-destructive mt-1">{serviceMobileError}</p>}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleNotDone} className="flex-1 py-2.5 bg-destructive text-destructive-foreground rounded-xl text-xs font-bold hover:opacity-90">
                Confirm &amp; Tag
              </button>
              <button onClick={() => setShowNotDone(false)} className="px-4 py-2.5 bg-card border border-border text-foreground rounded-xl text-xs font-semibold hover:bg-accent">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Installation Request Form */}
      {showInstallForm && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowInstallForm(false)}>
          <div className="bg-card rounded-2xl border border-border p-5 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground">Installation Request</h3>
              <button onClick={() => setShowInstallForm(false)} className="p-1 hover:bg-accent rounded-lg"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Provide end-customer details. This creates a customer record for future service journeys.
            </p>
            <div className="bg-accent/50 rounded-xl p-3 mb-4">
              <p className="text-[10px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Product Details (Auto-filled)</p>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <div><span className="text-muted-foreground">Product:</span> <span className="text-foreground font-medium">{item.name}</span></div>
                <div><span className="text-muted-foreground">Serial:</span> <span className="text-foreground font-medium">{item.serialNumber}</span></div>
              </div>
            </div>
            <form onSubmit={handleInstallSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Customer Name *</label>
                  <input required value={installForm.customerName} onChange={(e) => setInstallForm({ ...installForm, customerName: e.target.value })} className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Full name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Mobile Number *</label>
                  <input required pattern="[0-9]{10}" value={installForm.mobile} onChange={(e) => setInstallForm({ ...installForm, mobile: e.target.value })} className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-ring" placeholder="10-digit mobile" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Installation Address *</label>
                <textarea required value={installForm.address} onChange={(e) => setInstallForm({ ...installForm, address: e.target.value })} className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-ring resize-none" rows={2} placeholder="Full address" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">City *</label>
                  <input required value={installForm.city} onChange={(e) => setInstallForm({ ...installForm, city: e.target.value })} className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-ring" placeholder="City" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Pincode *</label>
                  <input required pattern="[0-9]{6}" value={installForm.pincode} onChange={(e) => setInstallForm({ ...installForm, pincode: e.target.value })} className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-ring" placeholder="6-digit pincode" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Additional Notes</label>
                <textarea value={installForm.notes} onChange={(e) => setInstallForm({ ...installForm, notes: e.target.value })} className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-ring resize-none" rows={2} placeholder="Floor, landmark, special instructions..." />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity">
                  Submit Installation Request
                </button>
                <button type="button" onClick={() => setShowInstallForm(false)} className="px-4 py-2.5 bg-card border border-border text-foreground rounded-xl text-xs font-semibold hover:bg-accent transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
