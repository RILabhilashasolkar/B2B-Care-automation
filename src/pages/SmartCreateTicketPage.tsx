import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { mockOrders, mockCustomers, ticketCategories } from "../lib/mockData";
import {
  ArrowLeft, Package, User, Phone, MapPin, ShieldCheck,
  AlertCircle, ChevronRight, Upload, CheckCircle,
} from "lucide-react";

export default function SmartCreateTicketPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const orderId    = searchParams.get("orderId")    || "";
  const itemId     = searchParams.get("itemId")     || "";
  const shipmentId = searchParams.get("shipmentId") || "";

  // ── Resolve order / shipment / item ──────────────────────────────────────
  const order    = mockOrders.find((o) => o.id === orderId);
  const shipment =
    order?.shipments.find((s) => s.id === shipmentId) ??
    order?.shipments.find((s) => s.items.some((i) => i.id === itemId));
  const item =
    shipment?.items.find((i) => i.id === itemId) ??
    order?.shipments.flatMap((s) => s.items).find((i) => i.id === itemId);

  // ── Detect customer (serial-number → customer mapping) ───────────────────
  const customer = item
    ? (mockCustomers.find((c) =>
        c.purchases.some(
          (p) => p.serialNumber.toLowerCase() === item.serialNumber.toLowerCase()
        )
      ) ??
      (item.customerMobile
        ? mockCustomers.find((c) => c.mobile === item.customerMobile)
        : undefined))
    : undefined;

  const purchase = customer?.purchases.find(
    (p) => p.serialNumber.toLowerCase() === (item?.serialNumber.toLowerCase() ?? "")
  );

  // ── Ticket type auto-detected ─────────────────────────────────────────────
  const ticketType: "customer" | "self" = customer ? "customer" : "self";
  const categories =
    ticketType === "self" ? ticketCategories.self : ticketCategories.customer;

  // ── Form state ────────────────────────────────────────────────────────────
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    category: "",
    subcategory: "",
    subSubcategory: "",
    description: "",
  });

  const selectedCat = categories.find((c) => c.category === form.category);
  const selectedSub = selectedCat?.subcategories.find(
    (s) => s.name === form.subcategory
  );

  const handleSubmit = () => {
    const ticketId = `TKT-${ticketType === "self" ? "S" : "C"}-${String(
      Date.now()
    ).slice(-4)}`;
    alert(
      `✅ Ticket created!\n\nTicket ID: ${ticketId}\nType: ${
        ticketType === "customer" ? "Customer Complaint" : "Self Complaint"
      }\nCategory: ${form.category} › ${form.subcategory} › ${form.subSubcategory}`
    );
    navigate(itemId ? `/orders/${orderId}/item/${itemId}` : `/orders/${orderId}`);
  };

  const backHref = itemId
    ? `/orders/${orderId}/item/${itemId}`
    : orderId
    ? `/orders/${orderId}`
    : "/orders";

  const inputCls =
    "w-full px-3 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <div className="space-y-3 animate-fade-in pb-4">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <Link
          to={backHref}
          className="p-2 rounded-lg hover:bg-accent transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-foreground">Create Ticket</h1>
          <p className="text-xs text-muted-foreground">Step {step} of 4</p>
        </div>
        {/* Auto-detected ticket type badge */}
        <span
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
            ticketType === "customer"
              ? "bg-violet-100 text-violet-700 border border-violet-200"
              : "bg-blue-100 text-blue-700 border border-blue-200"
          }`}
        >
          {ticketType === "customer" ? "👤 Customer" : "🏪 Self"}
        </span>
      </div>

      {/* ── Progress bar ── */}
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors ${
              s <= step ? "bg-primary" : "bg-border"
            }`}
          />
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════════
          STEP 1 — Pre-filled Context
      ════════════════════════════════════════════════════════════════ */}
      {step === 1 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-foreground">
              Order &amp; Item Details
            </h2>
            <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              Auto-filled
            </span>
          </div>

          {/* Order / Shipment / Item block */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Order ID
                </p>
                <p className="text-[11px] font-mono font-bold text-foreground mt-0.5 break-all">
                  {orderId || "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Shipment ID
                </p>
                <p className="text-[11px] font-mono font-bold text-foreground mt-0.5">
                  {shipment?.id || shipmentId || "—"}
                </p>
              </div>
              {item && (
                <>
                  <div className="col-span-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Product
                    </p>
                    <p className="text-xs font-semibold text-foreground mt-0.5">
                      {item.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Serial Number
                    </p>
                    <p className="text-[11px] font-mono font-bold text-foreground mt-0.5">
                      {item.serialNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      SKU
                    </p>
                    <p className="text-[11px] font-mono text-foreground mt-0.5">
                      {item.sku}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Customer card — shown when item is sold to a customer */}
          {customer && (
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-violet-600 flex-shrink-0" />
                <p className="text-xs font-bold text-violet-900">
                  Sold to Customer
                </p>
                {purchase?.warrantyStatus && (
                  <span
                    className={`ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0 ${
                      purchase.warrantyStatus === "Active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    {purchase.warrantyStatus}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Customer Name
                  </p>
                  <p className="text-xs font-semibold text-foreground mt-0.5">
                    {customer.name}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Mobile
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-muted-foreground" />
                    <p className="text-xs font-semibold text-foreground">
                      +91 {customer.mobile}
                    </p>
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Address
                  </p>
                  <div className="flex items-start gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-foreground">
                      {customer.address}, {customer.city} — {customer.pincode}
                    </p>
                  </div>
                </div>
              </div>
              {customer.tickets.length > 0 && (
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <p className="text-[11px] text-amber-800">
                    {customer.tickets.length} previous ticket
                    {customer.tickets.length > 1 ? "s" : ""} for this customer
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Self ticket notice */}
          {!customer && item && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-2">
              <Package className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800">
                Item not yet linked to a customer —{" "}
                <span className="font-bold">raising as Self Complaint</span>
              </p>
            </div>
          )}

          <button
            onClick={() => setStep(2)}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-xs font-bold"
          >
            Continue to Category
          </button>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          STEP 2 — Category / Sub / SubSub
      ════════════════════════════════════════════════════════════════ */}
      {step === 2 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-foreground">Select Category</h2>

          <div className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat.category}
                onClick={() =>
                  setForm({
                    ...form,
                    category: cat.category,
                    subcategory: "",
                    subSubcategory: "",
                  })
                }
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                  form.category === cat.category
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <span className="text-xs font-semibold text-foreground">
                  {cat.category}
                </span>
              </button>
            ))}
          </div>

          {form.category && selectedCat && (
            <>
              <h3 className="text-xs font-bold text-foreground mt-1">
                Subcategory
              </h3>
              <div className="space-y-2">
                {selectedCat.subcategories.map((sub) => (
                  <button
                    key={sub.name}
                    onClick={() =>
                      setForm({ ...form, subcategory: sub.name, subSubcategory: "" })
                    }
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                      form.subcategory === sub.name
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <span className="text-xs font-medium text-foreground">
                      {sub.name}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {form.subcategory && selectedSub && (
            <>
              <h3 className="text-xs font-bold text-foreground mt-1">
                Issue Type
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedSub.subSub.map((ss) => (
                  <button
                    key={ss}
                    onClick={() => setForm({ ...form, subSubcategory: ss })}
                    className={`px-3 py-2 rounded-xl border text-xs transition-all ${
                      form.subSubcategory === ss
                        ? "border-primary bg-primary/5 text-primary font-semibold"
                        : "border-border bg-card text-foreground hover:border-primary/30"
                    }`}
                  >
                    {ss}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="flex gap-2 pt-1">
            {form.subSubcategory && (
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl text-xs font-bold"
              >
                Continue{" "}
                <ChevronRight className="inline w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setStep(1)}
              className="px-4 py-3 bg-card border border-border rounded-xl text-xs font-semibold text-foreground"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          STEP 3 — Description + Attachments
      ════════════════════════════════════════════════════════════════ */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-foreground">Describe the Issue</h2>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              Issue Description *
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputCls + " resize-none"}
              rows={4}
              placeholder="Describe the issue in detail..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              Attachments (optional)
            </label>
            <div className="border-2 border-dashed border-border rounded-xl p-5 text-center cursor-pointer hover:border-primary/30 transition-colors">
              <Upload className="w-7 h-7 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">
                Tap to upload photos, invoices or screenshots
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Max 5MB each
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep(4)}
              disabled={!form.description}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl text-xs font-bold disabled:opacity-50"
            >
              Review &amp; Submit
            </button>
            <button
              onClick={() => setStep(2)}
              className="px-4 py-3 bg-card border border-border rounded-xl text-xs font-semibold text-foreground"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          STEP 4 — Review & Confirm
      ════════════════════════════════════════════════════════════════ */}
      {step === 4 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-foreground">
            Review &amp; Confirm
          </h2>

          {/* Ticket type pill */}
          <div
            className={`rounded-xl px-4 py-2.5 border ${
              ticketType === "customer"
                ? "bg-violet-50 border-violet-200"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <p
              className={`text-xs font-bold ${
                ticketType === "customer"
                  ? "text-violet-800"
                  : "text-blue-800"
              }`}
            >
              {ticketType === "customer"
                ? "👤 Customer Complaint"
                : "🏪 Self Complaint"}
            </p>
          </div>

          {/* Order + Item summary */}
          <div className="bg-card rounded-xl border border-border p-4 space-y-2 text-xs">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Order Details
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              <div>
                <span className="text-muted-foreground">Order: </span>
                <span className="font-mono font-bold text-foreground break-all">
                  {orderId}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Shipment: </span>
                <span className="font-mono font-bold text-foreground">
                  {shipment?.id || shipmentId}
                </span>
              </div>
              {item && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Product: </span>
                  <span className="font-semibold text-foreground">
                    {item.name}
                  </span>
                </div>
              )}
              {item && (
                <div>
                  <span className="text-muted-foreground">Serial: </span>
                  <span className="font-mono font-bold text-foreground">
                    {item.serialNumber}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Customer summary */}
          {customer && (
            <div className="bg-card rounded-xl border border-border p-4 space-y-1.5 text-xs">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Customer
              </p>
              <p>
                <span className="text-muted-foreground">Name: </span>
                <span className="font-semibold text-foreground">
                  {customer.name}
                </span>
              </p>
              <p>
                <span className="text-muted-foreground">Mobile: </span>
                <span className="font-semibold text-foreground">
                  +91 {customer.mobile}
                </span>
              </p>
            </div>
          )}

          {/* Category breadcrumb */}
          <div className="bg-card rounded-xl border border-border p-4 text-xs">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              Category
            </p>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-foreground">{form.category}</span>
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
              <span className="font-semibold text-foreground">
                {form.subcategory}
              </span>
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
              <span className="text-primary font-semibold">
                {form.subSubcategory}
              </span>
            </div>
          </div>

          {/* Description */}
          {form.description && (
            <div className="bg-card rounded-xl border border-border p-4 text-xs">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                Description
              </p>
              <p className="text-foreground leading-relaxed">{form.description}</p>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl text-xs font-bold flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Submit Ticket
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-4 py-3 bg-card border border-border rounded-xl text-xs font-semibold text-foreground"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
