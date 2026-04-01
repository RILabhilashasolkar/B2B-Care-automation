import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { mockCustomers, mockCustomerTickets, type CustomerPurchase } from "../lib/mockData";
import {
  ArrowLeft, Package, Clock, Wrench, AlertTriangle,
  MessageSquareWarning, ChevronRight, Phone,
  MapPin, ShieldCheck, Mail, X, CheckCircle, ChevronDown,
} from "lucide-react";

// ── Ticket classifiers ─────────────────────────────────────────────────────
const PRODUCT_COMPLAINT_CATS = new Set([
  "Order Issues", "Delivery Issues", "Billing & Payments", "Returns & Refunds", "Returns",
]);
const SERVICE_CATS   = new Set(["Installation", "Repair & Service"]);
const COMPLAINT_CATS = new Set(["Complaint Against Service"]);

// ── Status badge ───────────────────────────────────────────────────────────
function statusCls(status: string) {
  if (status === "Open")          return "status-open";
  if (status === "In Progress")   return "status-in-progress";
  if (status === "Awaiting Info") return "status-awaiting";
  if (status === "Resolved")      return "status-resolved";
  return "status-closed";
}

// ── Service type options ───────────────────────────────────────────────────
const SERVICE_TYPES = [
  "Repair",
  "Annual Service (PMS)",
  "Inspection",
  "Demo",
  "Part Replacement",
];

type ServiceForm = {
  serviceType: string;
  address: string;
  city: string;
  pincode: string;
  preferredDate: string;
  notes: string;
};
const EMPTY_SERVICE_FORM: ServiceForm = {
  serviceType: "", address: "", city: "", pincode: "", preferredDate: "", notes: "",
};

// ── Input class ────────────────────────────────────────────────────────────
const inputCls = (err?: boolean) =>
  `w-full px-3 py-2.5 bg-background border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground ${
    err ? "border-red-400 focus:ring-red-300" : "border-border"
  }`;

export default function CustomerProfilePage() {
  const { customerId } = useParams();
  const navigate       = useNavigate();

  // ── Service Request modal state ──────────────────────────────────────────
  const [serviceProduct, setServiceProduct] = useState<CustomerPurchase | null>(null);
  const [serviceForm, setServiceForm]       = useState<ServiceForm>(EMPTY_SERVICE_FORM);
  const [serviceErrors, setServiceErrors]   = useState<Partial<ServiceForm>>({});

  const customer = mockCustomers.find((c) => c.id === customerId);
  if (!customer)
    return <div className="text-center py-20 text-xs text-muted-foreground">Customer not found</div>;

  // All tickets for this customer
  const allTickets = mockCustomerTickets.filter((t) => t.customerMobile === customer.mobile);

  // ── Open modal — auto-fill customer address ──────────────────────────────
  const openServiceModal = (purchase: CustomerPurchase) => {
    setServiceProduct(purchase);
    setServiceForm({
      ...EMPTY_SERVICE_FORM,
      address: customer.address,
      city:    customer.city,
      pincode: customer.pincode,
    });
    setServiceErrors({});
  };

  // ── Validate + submit ────────────────────────────────────────────────────
  const handleServiceSubmit = () => {
    const errs: Partial<ServiceForm> = {};
    if (!serviceForm.serviceType) errs.serviceType = "Required";
    if (!serviceForm.address.trim()) errs.address  = "Required";
    if (!serviceForm.city.trim())    errs.city     = "Required";
    if (!/^\d{6}$/.test(serviceForm.pincode)) errs.pincode = "Enter valid 6-digit pincode";
    if (Object.keys(errs).length) { setServiceErrors(errs); return; }

    const ticketId = `TKT-SVC-${Date.now().toString().slice(-4)}`;
    alert(
      `✅ Service Request created!\n\nTicket: ${ticketId}\nType: ${serviceForm.serviceType}\nProduct: ${serviceProduct?.productName}\nCustomer: ${customer.name} · +91 ${customer.mobile}`
    );
    setServiceProduct(null);
    setServiceForm(EMPTY_SERVICE_FORM);
    setServiceErrors({});
  };

  const sf = (field: keyof ServiceForm, value: string) => {
    setServiceForm((prev) => ({ ...prev, [field]: value }));
    if (serviceErrors[field]) setServiceErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="space-y-3 animate-fade-in pb-4">

      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <Link to="/service/customer" className="p-2 rounded-lg hover:bg-accent transition-colors flex-shrink-0">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-foreground">{customer.name}</h1>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {customer.mobile} · {customer.city} · {customer.pincode}
          </p>
        </div>
        {allTickets.length > 0 && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 flex-shrink-0">
            {allTickets.length} ticket{allTickets.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* ── 1. Customer Details ── */}
      <div className="bg-card rounded-xl border border-border p-4">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
          Customer Details
        </p>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">{customer.name.charAt(0)}</span>
            </div>
            <p className="text-xs font-bold text-foreground">{customer.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <p className="text-xs text-foreground">+91 {customer.mobile}</p>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-xs text-foreground">
              {customer.address}, {customer.city} — {customer.pincode}
            </p>
          </div>
          {customer.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <p className="text-xs text-foreground">{customer.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── 2. Product Purchase History ── */}
      <p className="text-xs font-bold text-foreground px-0.5">
        Product Purchase History ({customer.purchases.length})
      </p>

      {customer.purchases.map((p) => {
        const productTickets    = allTickets.filter((t) => t.serialNumber === p.serialNumber);
        const productComplaints = productTickets.filter((t) => PRODUCT_COMPLAINT_CATS.has(t.category));
        const serviceOrders     = productTickets.filter((t) => SERVICE_CATS.has(t.category));
        const serviceComplaints = productTickets.filter((t) => COMPLAINT_CATS.has(t.category));
        const installInProgress = p.installationStatus === "Pending" && serviceOrders.length > 0;

        return (
          <div key={p.id} className="bg-card rounded-xl border border-border overflow-hidden">

            {/* ── Product Header ── */}
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Package className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground leading-snug">{p.productName}</p>
                  <p className="text-[10px] font-mono text-muted-foreground mt-0.5">SN: {p.serialNumber}</p>
                  <p className="text-[10px] font-mono text-muted-foreground">Order: {p.orderId}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                    p.warrantyStatus === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  }`}>
                    Warranty {p.warrantyStatus}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                    p.installationStatus === "Completed" ? "bg-emerald-100 text-emerald-700"
                    : installInProgress               ? "bg-blue-100 text-blue-700"
                    : p.installationStatus === "Pending" ? "bg-amber-100 text-amber-700"
                    : "bg-muted text-muted-foreground"
                  }`}>
                    {p.installationStatus === "Completed" ? "Installed"
                     : installInProgress                  ? "Installation: In Progress"
                     : p.installationStatus === "Pending" ? "Installation: Pending"
                     : "Not Required"}
                  </span>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-center gap-4 mt-2.5">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">
                    Purchased: {new Date(p.purchaseDate).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"2-digit" })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">
                    Warranty: {new Date(p.warrantyExpiry).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"2-digit" })}
                  </span>
                </div>
              </div>

              {/* ── Action Buttons ── */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => navigate(`/ticket/create?customerId=${customer.id}&preSelectSerial=${p.serialNumber}`)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-[10px] font-semibold hover:bg-blue-100 active:opacity-80 transition-colors"
                >
                  <AlertTriangle className="w-3 h-3" /> Raise Complaint
                </button>
                <button
                  onClick={() => openServiceModal(p)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-teal-50 border border-teal-200 text-teal-700 rounded-lg text-[10px] font-semibold hover:bg-teal-100 active:opacity-80 transition-colors"
                >
                  <Wrench className="w-3 h-3" /> Service Request
                </button>
              </div>
            </div>

            {/* ── a. Product Related Complaints ── */}
            {productComplaints.length > 0 && (
              <div className="border-t border-border">
                <div className="px-4 py-2 bg-blue-50/60">
                  <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                    Product Related Complaints ({productComplaints.length})
                  </p>
                </div>
                {productComplaints.map((t) => (
                  <Link key={t.id} to={`/ticket/${t.id}`}
                    className="flex items-center justify-between px-4 py-2.5 border-t border-border/40 hover:bg-accent/40 transition-colors group">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-bold text-primary">{t.id}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${statusCls(t.status)}`}>{t.status}</span>
                      </div>
                      <p className="text-[10px] text-foreground truncate">{t.category} → {t.subcategory}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(t.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"2-digit" })}
                        {t.assignedTo ? ` · ${t.assignedTo}` : ""}
                      </p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary flex-shrink-0 ml-2" />
                  </Link>
                ))}
              </div>
            )}

            {/* ── b. Service Orders ── */}
            {serviceOrders.length > 0 && (
              <div className="border-t border-border">
                <div className="px-4 py-2 bg-teal-50/60">
                  <p className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                    Service Orders ({serviceOrders.length})
                  </p>
                </div>
                {serviceOrders.map((t) => (
                  <div key={t.id} className="border-t border-border/40">
                    <Link to={`/ticket/${t.id}`}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-accent/40 transition-colors group">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] font-bold text-primary">{t.id}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${statusCls(t.status)}`}>{t.status}</span>
                        </div>
                        <p className="text-[10px] text-foreground truncate">{t.category} → {t.subcategory}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(t.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"2-digit" })}
                          {t.assignedTo ? ` · ${t.assignedTo}` : ""}
                        </p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary flex-shrink-0 ml-2" />
                    </Link>
                    {t.status !== "Resolved" && t.status !== "Closed" && (
                      <button
                        onClick={() => navigate(
                          `/ticket/create?customerId=${customer.id}&category=Complaint+Against+Service&relatedTicket=${t.id}&serialNumber=${t.serialNumber ?? ""}`
                        )}
                        className="w-full flex items-center justify-between gap-2 px-4 py-2 bg-red-50 border-t border-red-100 hover:bg-red-100 active:opacity-80 transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <MessageSquareWarning className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                          <span className="text-[10px] font-semibold text-red-700">Raise Complaint Against This Service</span>
                        </div>
                        <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full border border-red-200 font-semibold flex-shrink-0">{t.id}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── c. Complaints Against Service ── */}
            {serviceComplaints.length > 0 && (
              <div className="border-t border-border">
                <div className="px-4 py-2 bg-red-50/60">
                  <p className="text-[10px] font-bold text-red-800 uppercase tracking-wider">
                    Complaints Against Service ({serviceComplaints.length})
                  </p>
                </div>
                {serviceComplaints.map((t) => (
                  <Link key={t.id} to={`/ticket/${t.id}`}
                    className="flex items-center justify-between px-4 py-2.5 border-t border-border/40 hover:bg-accent/40 transition-colors group">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-bold text-primary">{t.id}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${statusCls(t.status)}`}>{t.status}</span>
                      </div>
                      <p className="text-[10px] text-foreground truncate">{t.category} → {t.subcategory}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(t.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"2-digit" })}
                        {t.assignedTo ? ` · ${t.assignedTo}` : ""}
                      </p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary flex-shrink-0 ml-2" />
                  </Link>
                ))}
              </div>
            )}

            {productComplaints.length === 0 && serviceOrders.length === 0 && serviceComplaints.length === 0 && (
              <div className="border-t border-border px-4 py-3 text-center">
                <p className="text-[10px] text-muted-foreground italic">No tickets raised for this product yet</p>
              </div>
            )}
          </div>
        );
      })}

      {/* ════════════════════════════════════════════════
          SERVICE REQUEST MODAL
      ════════════════════════════════════════════════ */}
      {serviceProduct && (
        <div className="absolute inset-0 z-50 bg-black/50 flex items-end">
          <div className="bg-card w-full rounded-t-3xl shadow-2xl max-h-[92%] flex flex-col">

            {/* Modal header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border flex-shrink-0">
              <div>
                <h2 className="text-sm font-bold text-foreground">Raise Service Request</h2>
                <p className="text-[10px] text-muted-foreground mt-0.5">Repair / PMS / Inspection</p>
              </div>
              <button onClick={() => setServiceProduct(null)} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Scrollable form body */}
            <div className="flex-1 overflow-y-auto phone-scroll px-4 py-4 space-y-4">

              {/* Auto-filled: Product info */}
              <div className="bg-primary/5 border border-primary/15 rounded-xl px-4 py-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Product</p>
                <p className="text-xs font-bold text-foreground">{serviceProduct.productName}</p>
                <p className="text-[10px] font-mono text-muted-foreground mt-0.5">SN: {serviceProduct.serialNumber}</p>
              </div>

              {/* Auto-filled: Customer info */}
              <div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Customer</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Name</p>
                    <p className="text-xs font-semibold text-foreground">{customer.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Mobile</p>
                    <p className="text-xs font-semibold text-foreground">+91 {customer.mobile}</p>
                  </div>
                </div>
              </div>

              {/* Service Type — dropdown */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={serviceForm.serviceType}
                    onChange={(e) => sf("serviceType", e.target.value)}
                    className={`${inputCls(!!serviceErrors.serviceType)} appearance-none pr-8`}
                  >
                    <option value="">Select service type...</option>
                    {SERVICE_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                </div>
                {serviceErrors.serviceType && (
                  <p className="text-[10px] text-red-500 mt-1">{serviceErrors.serviceType}</p>
                )}
              </div>

              {/* Service Address */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">
                  Service Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Street address"
                  value={serviceForm.address}
                  onChange={(e) => sf("address", e.target.value)}
                  className={inputCls(!!serviceErrors.address)}
                />
                {serviceErrors.address && (
                  <p className="text-[10px] text-red-500 mt-1">{serviceErrors.address}</p>
                )}
              </div>

              {/* City + Pincode */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1.5 block">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="City"
                    value={serviceForm.city}
                    onChange={(e) => sf("city", e.target.value)}
                    className={inputCls(!!serviceErrors.city)}
                  />
                  {serviceErrors.city && (
                    <p className="text-[10px] text-red-500 mt-1">{serviceErrors.city}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1.5 block">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="6-digit"
                    value={serviceForm.pincode}
                    maxLength={6}
                    onChange={(e) => sf("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className={inputCls(!!serviceErrors.pincode)}
                  />
                  {serviceErrors.pincode && (
                    <p className="text-[10px] text-red-500 mt-1">{serviceErrors.pincode}</p>
                  )}
                </div>
              </div>

              {/* Preferred Date */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">Preferred Date</label>
                <input
                  type="date"
                  value={serviceForm.preferredDate}
                  onChange={(e) => sf("preferredDate", e.target.value)}
                  className={inputCls()}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">Notes (optional)</label>
                <textarea
                  rows={3}
                  placeholder="Describe the issue or special instructions..."
                  value={serviceForm.notes}
                  onChange={(e) => sf("notes", e.target.value)}
                  className={`${inputCls()} resize-none`}
                />
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex gap-3 px-4 py-4 border-t border-border flex-shrink-0">
              <button
                onClick={handleServiceSubmit}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:opacity-90 active:opacity-80 transition-opacity"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Submit Request
              </button>
              <button
                onClick={() => setServiceProduct(null)}
                className="px-5 py-3 bg-card border border-border rounded-xl text-xs font-semibold text-foreground hover:bg-accent transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
