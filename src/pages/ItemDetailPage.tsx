import { useParams, Link, useNavigate } from "react-router-dom";
import { mockOrders, type ServiceOrderStatus } from "../lib/mockData";
import { ArrowLeft, Package, Wrench, AlertTriangle, MessageCircle, Phone, Ban, X } from "lucide-react";
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
  const order = mockOrders.find((o) => o.id === orderId);
  const item = order?.shipments.flatMap((s) => s.items).find((i) => i.id === itemId);
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
          <p className="text-sm text-muted-foreground">{orderId}</p>
        </div>
      </div>

      {/* Product Card */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-foreground">{item.name}</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-3 text-sm">
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
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">SERVICE ORDER</p>
              <p className="text-lg font-bold text-foreground">{so.id}</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[so.status]}`}>
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
          <p className="text-xs text-muted-foreground">📱 Customer: +91{so.customerMobile} · Updated: {new Date(so.updatedAt).toLocaleDateString("en-IN")}</p>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {(item.installationNotByUs || notDoneTagged) && (
          <span className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-medium bg-destructive/10 text-destructive">
            <Ban className="w-3.5 h-3.5" /> Installation Not Done by Us
          </span>
        )}
        {linkSent && !so && (
          <span className="text-xs px-3 py-1.5 rounded-full font-medium bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]">
            ✓ Service Link Sent (+91{serviceMobile})
          </span>
        )}
        {item.customerMobile && (
          <span className="text-xs px-3 py-1.5 rounded-full font-medium bg-[hsl(var(--info))]/10 text-[hsl(var(--info))]">
            📱 +91{item.customerMobile}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {item.installationEligible && !item.installationRequested && (
          <button
            onClick={() => setShowInstallForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Wrench className="w-4 h-4" />
            Raise Installation Request
          </button>
        )}
        {item.installationRequested && (
          <span className="flex items-center gap-2 px-4 py-2.5 bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] rounded-lg text-sm font-medium">
            ✓ Installation Already Requested
          </span>
        )}
        {!linkSent && !item.customerMobile && (
          <button
            onClick={() => setShowServiceLink(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border border-[hsl(var(--success))]/20 rounded-lg text-sm font-medium hover:bg-[hsl(var(--success))]/20 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Send Service Link
          </button>
        )}
        {!notDoneTagged && !item.installationNotByUs && !item.installationRequested && (
          <button
            onClick={() => setShowNotDone(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-sm font-medium hover:bg-destructive/20 transition-colors"
          >
            <Ban className="w-4 h-4" />
            Not Done by Us
          </button>
        )}
        <button
          onClick={() => navigate(`/service/self/create?orderId=${orderId}&itemId=${itemId}`)}
          className="flex items-center gap-2 px-5 py-2.5 bg-card border border-border text-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors"
        >
          <AlertTriangle className="w-4 h-4" />
          Report Issue
        </button>
      </div>

      {/* Send Service Link Modal */}
      {showServiceLink && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowServiceLink(false)}>
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Send Service Link</h3>
              <button onClick={() => setShowServiceLink(false)} className="p-1 hover:bg-accent rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Send a WhatsApp/SMS link to the customer for self-service order creation.</p>
            <div className="mb-1">
              <label className="block text-sm font-medium text-foreground mb-1.5">Customer Mobile Number *</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground font-medium">+91</span>
                <input
                  value={serviceMobile}
                  onChange={(e) => { setServiceMobile(e.target.value.replace(/\D/g, "").slice(0, 10)); setServiceMobileError(""); }}
                  className="flex-1 px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter 10-digit mobile"
                />
              </div>
              {serviceMobileError && <p className="text-xs text-destructive mt-1">{serviceMobileError}</p>}
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={handleSendLink} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[hsl(var(--success))] text-white rounded-lg text-sm font-medium hover:opacity-90">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </button>
              <button onClick={handleSendLink} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
                <Phone className="w-4 h-4" /> SMS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Not Done By Us Modal */}
      {showNotDone && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowNotDone(false)}>
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Installation Not Done by Us</h3>
              <button onClick={() => setShowNotDone(false)} className="p-1 hover:bg-accent rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Tag this item as "Installation Not Done by Us" and capture customer mobile.</p>
            <div className="mb-1">
              <label className="block text-sm font-medium text-foreground mb-1.5">Customer Mobile Number *</label>
              <input
                value={serviceMobile}
                onChange={(e) => { setServiceMobile(e.target.value.replace(/\D/g, "").slice(0, 10)); setServiceMobileError(""); }}
                className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter 10-digit mobile"
              />
              {serviceMobileError && <p className="text-xs text-destructive mt-1">{serviceMobileError}</p>}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handleNotDone} className="flex-1 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:opacity-90">
                Confirm & Tag
              </button>
              <button onClick={() => setShowNotDone(false)} className="px-4 py-2.5 bg-card border border-border text-foreground rounded-lg text-sm font-medium hover:bg-accent">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Installation Request Form */}
      {showInstallForm && (
        <div className="bg-card rounded-xl border-2 border-primary/20 p-6">
          <h3 className="text-lg font-bold text-foreground mb-1">Installation Request</h3>
          <p className="text-sm text-muted-foreground mb-5">
            Provide end-customer details for installation. This creates a customer record for future service journeys.
          </p>
          <form onSubmit={handleInstallSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Customer Name *</label>
                <input required value={installForm.customerName} onChange={(e) => setInstallForm({ ...installForm, customerName: e.target.value })} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Mobile Number *</label>
                <input required pattern="[0-9]{10}" value={installForm.mobile} onChange={(e) => setInstallForm({ ...installForm, mobile: e.target.value })} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="10-digit mobile" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Installation Address *</label>
              <textarea required value={installForm.address} onChange={(e) => setInstallForm({ ...installForm, address: e.target.value })} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" rows={2} placeholder="Full address" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">City *</label>
                <input required value={installForm.city} onChange={(e) => setInstallForm({ ...installForm, city: e.target.value })} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="City" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Pincode *</label>
                <input required pattern="[0-9]{6}" value={installForm.pincode} onChange={(e) => setInstallForm({ ...installForm, pincode: e.target.value })} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="6-digit pincode" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Additional Notes</label>
              <textarea value={installForm.notes} onChange={(e) => setInstallForm({ ...installForm, notes: e.target.value })} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" rows={2} placeholder="Any special instructions..." />
            </div>
            <div className="bg-accent/50 rounded-lg p-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">PRODUCT DETAILS (AUTO-FILLED)</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Product:</span> <span className="text-foreground">{item.name}</span></div>
                <div><span className="text-muted-foreground">Serial:</span> <span className="text-foreground">{item.serialNumber}</span></div>
                <div><span className="text-muted-foreground">Order:</span> <span className="text-foreground">{orderId}</span></div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                Submit Installation Request
              </button>
              <button type="button" onClick={() => setShowInstallForm(false)} className="px-6 py-2.5 bg-card border border-border text-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
