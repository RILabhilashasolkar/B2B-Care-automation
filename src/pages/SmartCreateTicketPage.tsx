import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { mockOrders, mockCustomers, mockCustomerTickets, ticketCategories } from "../lib/mockData";
import {
  ArrowLeft, Package, User, Phone, MapPin, ShieldCheck,
  AlertCircle, ChevronRight, Upload, CheckCircle, Truck, Wrench,
} from "lucide-react";

// Maps actionType param → suggested category name in ticketCategories.customer
const ACTION_CATEGORY: Record<string, string> = {
  installation:              "Installation",
  service:                   "Repair & Service",
  complaint_against_service: "Complaint Against Service",
};

export default function SmartCreateTicketPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ── URL params ────────────────────────────────────────────────────────────
  const orderId        = searchParams.get("orderId")        || "";
  const itemId         = searchParams.get("itemId")         || "";
  const shipmentId     = searchParams.get("shipmentId")     || "";
  const customerId     = searchParams.get("customerId")     || "";
  const actionType     = searchParams.get("actionType")     || "";
  const level          = searchParams.get("level")          || "";  // "order" | "shipment" | ""
  const source         = searchParams.get("source")         || "";  // "help" = came from /help/complaint
  const relatedTicketId  = searchParams.get("relatedTicket")  || "";  // related service ticket id (for complaint-against-service)
  const preCategory      = searchParams.get("category")       || "";  // pre-selected category from URL
  const preSelectSerial  = searchParams.get("preSelectSerial") || ""; // pre-select product by serial in customer mode

  // ── Entry mode ────────────────────────────────────────────────────────────
  // "item"     → came from OrderDetailPage / ItemDetailPage with orderId+itemId+shipmentId
  // "customer" → came from CustomerProfilePage with customerId (no item selected yet)
  // "generic"  → no context (fallback)
  const entryMode: "item" | "customer" | "generic" =
    itemId ? "item" : customerId ? "customer" : "generic";

  // ── Item-mode: resolve from URL params ────────────────────────────────────
  const order    = orderId ? mockOrders.find((o) => o.id === orderId) : undefined;
  const shipment = order
    ? (order.shipments.find((s) => s.id === shipmentId) ??
       order.shipments.find((s) => s.items.some((i) => i.id === itemId)))
    : undefined;
  const item =
    shipment?.items.find((i) => i.id === itemId) ??
    order?.shipments.flatMap((s) => s.items).find((i) => i.id === itemId);

  // ── Customer-mode: resolve customer by ID ────────────────────────────────
  const customerById = customerId
    ? mockCustomers.find((c) => c.id === customerId)
    : undefined;

  // ── Item-mode: detect customer from serial / mobile ───────────────────────
  // Customer visibility is only gained AFTER installation, first service, or "not done by us" tagging
  const customerRevealedForItem =
    item && (item.installationRequested || !!item.serviceOrder || item.installationNotByUs);

  const customerFromItem = customerRevealedForItem
    ? (mockCustomers.find((c) =>
          c.purchases.some(
            (p) => p.serialNumber.toLowerCase() === item!.serialNumber.toLowerCase()
          )
        ) ??
        (item!.customerMobile
          ? mockCustomers.find((c) => c.mobile === item!.customerMobile)
          : undefined))
    : undefined;

  // ── Customer-mode: product picker state ──────────────────────────────────
  // Auto-select product when preSelectSerial is provided (e.g. from CustomerProfilePage action)
  const preSelectedPurchase = preSelectSerial && customerById
    ? customerById.purchases.find(
        (p) => p.serialNumber.toLowerCase() === preSelectSerial.toLowerCase()
      ) ?? null
    : null;

  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string | null>(
    preSelectedPurchase?.id ?? null
  );

  const selectedPurchase = selectedPurchaseId
    ? customerById?.purchases.find((p) => p.id === selectedPurchaseId)
    : null;

  // Derive order/shipment/item from selected purchase (customer mode)
  const derivedOrder    = selectedPurchase
    ? mockOrders.find((o) => o.id === selectedPurchase.orderId)
    : undefined;
  const derivedShipment = derivedOrder?.shipments.find((s) =>
    s.items.some(
      (i) => i.serialNumber.toLowerCase() === (selectedPurchase?.serialNumber.toLowerCase() ?? "")
    )
  );
  const derivedItem = derivedShipment?.items.find(
    (i) => i.serialNumber.toLowerCase() === (selectedPurchase?.serialNumber.toLowerCase() ?? "")
  );

  // ── Effective merged context (works for both modes) ───────────────────────
  const effectiveOrder    = order    ?? derivedOrder;
  const effectiveShipment = shipment ?? derivedShipment;
  const effectiveItem     = item     ?? derivedItem;
  const effectiveCustomer = customerFromItem ?? (entryMode === "customer" ? customerById : undefined);
  const effectivePurchase = effectiveCustomer?.purchases.find(
    (p) => p.serialNumber.toLowerCase() === (effectiveItem?.serialNumber.toLowerCase() ?? "")
  );

  const hasCustomerMobile = !effectiveCustomer && !!effectiveItem?.customerMobile;

  // ── Ticket type ───────────────────────────────────────────────────────────
  const ticketType: "customer" | "self" =
    entryMode === "customer" || effectiveCustomer || hasCustomerMobile
      ? "customer"
      : "self";

  const categories =
    ticketType === "self" ? ticketCategories.self : ticketCategories.customer;

  // Level-based category filtering (order→ Billing+OrderIssues, shipment→ DeliveryIssues)
  const LEVEL_CATS: Record<string, string[]> = {
    order:    ["Order Issues", "Billing & Payments"],
    shipment: ["Delivery Issues"],
  };
  const filteredCategories = LEVEL_CATS[level]
    ? categories.filter((c) => LEVEL_CATS[level].includes(c.category))
    : categories;

  const suggestedCategory = preCategory || (actionType ? (ACTION_CATEGORY[actionType] ?? "") : "");

  // ── Related service ticket (complaint-against-service flow) ───────────────
  const relatedTicketData = relatedTicketId
    ? mockCustomerTickets.find((t) => t.id === relatedTicketId)
    : undefined;

  // ── Form state ────────────────────────────────────────────────────────────
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    category:       suggestedCategory,
    subcategory:    "",
    subSubcategory: "",
    description:    "",
  });

  const selectedCat = categories.find((c) => c.category === form.category);
  const selectedSub = selectedCat?.subcategories.find((s) => s.name === form.subcategory);

  // ── Back navigation ───────────────────────────────────────────────────────
  const backHref = source === "help"
    ? "/help/complaint"
    : itemId
    ? `/orders/${orderId}/item/${itemId}`
    : orderId
    ? `/orders/${orderId}`
    : customerId
    ? `/service/customer/${customerId}`
    : "/orders";

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    const prefix  = ticketType === "self" ? "S" : "C";
    const ticketId = `TKT-${prefix}-${String(Date.now()).slice(-4)}`;
    alert(
      `✅ Ticket created!\n\nTicket ID: ${ticketId}\nType: ${
        ticketType === "customer" ? "Customer Complaint" : "Self Complaint"
      }\nCategory: ${form.category} › ${form.subcategory} › ${form.subSubcategory}`
    );
    navigate(backHref);
  };

  const inputCls =
    "w-full px-3 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40";

  // Step 1 readiness: customer mode requires a purchase to be selected
  const step1Ready = entryMode === "customer" ? !!selectedPurchaseId : true;

  // ── Status badge helpers ──────────────────────────────────────────────────
  const statusBadge = (s: string) =>
    s === "Delivered"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-blue-100 text-blue-700";

  const ticketStatusBadge = (s: string) =>
    s === "Open"          ? "bg-blue-100 text-blue-700" :
    s === "In Progress"   ? "bg-amber-100 text-amber-700" :
    s === "Awaiting Info" ? "bg-orange-100 text-orange-700" :
    s === "Resolved"      ? "bg-emerald-100 text-emerald-700" :
                            "bg-muted text-muted-foreground";

  const orderStatusBadge = (s: string) =>
    s === "Delivered"   ? "bg-emerald-100 text-emerald-700" :
    s === "Processing"  ? "bg-orange-100 text-orange-700"   :
                          "bg-blue-100 text-blue-700";

  return (
    <div className="space-y-3 animate-fade-in pb-4">

      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : navigate(backHref)}
          className="p-2 rounded-lg hover:bg-accent transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-foreground">Create Ticket</h1>
          <p className="text-xs text-muted-foreground">Step {step} of 4</p>
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 border ${
          ticketType === "customer"
            ? "bg-violet-100 text-violet-700 border-violet-200"
            : "bg-blue-100 text-blue-700 border-blue-200"
        }`}>
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

      {/* ════════════════════════════════════════════════════════════
          STEP 1 — Context (order+item auto-fill OR customer+product pick)
      ════════════════════════════════════════════════════════════ */}
      {step === 1 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-foreground">
              {entryMode === "customer" ? "Customer & Product" : "Order & Item Details"}
            </h2>
            <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              Auto-filled
            </span>
          </div>

          {/* ── CUSTOMER MODE ── */}
          {entryMode === "customer" && customerById && (
            <>
              {/* Customer card */}
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-violet-600 flex-shrink-0" />
                  <p className="text-xs font-bold text-violet-900">Customer</p>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Name</p>
                    <p className="text-xs font-semibold text-foreground mt-0.5">{customerById.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Mobile</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      <p className="text-xs font-semibold text-foreground">+91 {customerById.mobile}</p>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Address</p>
                    <div className="flex items-start gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-foreground">
                        {customerById.address}, {customerById.city} — {customerById.pincode}
                      </p>
                    </div>
                  </div>
                </div>
                {customerById.tickets.length > 0 && (
                  <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <p className="text-[11px] text-amber-800">
                      {customerById.tickets.length} previous ticket
                      {customerById.tickets.length > 1 ? "s" : ""}
                    </p>
                  </div>
                )}
              </div>

              {/* Product picker */}
              <div>
                <p className="text-xs font-bold text-foreground mb-2">Select Product for this Ticket *</p>
                <div className="space-y-2">
                  {customerById.purchases.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPurchaseId(p.id)}
                      className={`w-full text-left rounded-xl border p-3 transition-all ${
                        selectedPurchaseId === p.id
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Package className="w-4 h-4 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate">{p.productName}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              SN: <span className="font-mono font-bold">{p.serialNumber}</span>
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              Order: <span className="font-mono">{p.orderId}</span>
                            </p>
                          </div>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0 ${
                          p.warrantyStatus === "Active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          <ShieldCheck className="w-3 h-3" /> {p.warrantyStatus}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Derived order context after product selected */}
              {derivedItem && (
                <div className="bg-card border border-border rounded-xl p-4 space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Order Context (Auto-resolved)
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                    <div>
                      <span className="text-muted-foreground">Order: </span>
                      <span className="font-mono font-bold text-foreground break-all">
                        {derivedOrder?.id}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Shipment: </span>
                      <span className="font-mono font-bold text-foreground">
                        {derivedShipment?.id}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Product: </span>
                      <span className="font-semibold text-foreground">{derivedItem.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Serial: </span>
                      <span className="font-mono font-bold text-foreground">
                        {derivedItem.serialNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3 h-3 text-muted-foreground" />
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        statusBadge(derivedShipment?.status ?? "")
                      }`}>
                        {derivedShipment?.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── ITEM MODE ── */}
          {entryMode === "item" && (
            <>
              {/* Order / Shipment / Item block */}
              <div className="bg-card border border-border rounded-xl p-4">
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
                      {effectiveShipment?.id || shipmentId || "—"}
                    </p>
                  </div>
                  {effectiveItem && (
                    <>
                      <div className="col-span-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          Product
                        </p>
                        <p className="text-xs font-semibold text-foreground mt-0.5">
                          {effectiveItem.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          Serial Number
                        </p>
                        <p className="text-[11px] font-mono font-bold text-foreground mt-0.5">
                          {effectiveItem.serialNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          SKU
                        </p>
                        <p className="text-[11px] font-mono text-foreground mt-0.5">
                          {effectiveItem.sku}
                        </p>
                      </div>
                      <div className="col-span-2 flex items-center gap-2">
                        <Truck className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          statusBadge(effectiveShipment?.status ?? "")
                        }`}>
                          {effectiveShipment?.status || "—"}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Customer card — sold */}
              {effectiveCustomer && (
                <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-violet-600 flex-shrink-0" />
                    <p className="text-xs font-bold text-violet-900">Sold to Customer</p>
                    {effectivePurchase?.warrantyStatus && (
                      <span className={`ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0 ${
                        effectivePurchase.warrantyStatus === "Active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        <ShieldCheck className="w-3 h-3" /> {effectivePurchase.warrantyStatus}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Customer Name
                      </p>
                      <p className="text-xs font-semibold text-foreground mt-0.5">
                        {effectiveCustomer.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Mobile
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-muted-foreground" />
                        <p className="text-xs font-semibold text-foreground">
                          +91 {effectiveCustomer.mobile}
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
                          {effectiveCustomer.address}, {effectiveCustomer.city} —{" "}
                          {effectiveCustomer.pincode}
                        </p>
                      </div>
                    </div>
                  </div>
                  {effectiveCustomer.tickets.length > 0 && (
                    <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-2">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      <p className="text-[11px] text-amber-800">
                        {effectiveCustomer.tickets.length} previous ticket
                        {effectiveCustomer.tickets.length > 1 ? "s" : ""} for this customer
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* customerMobile known but no full record */}
              {hasCustomerMobile && (
                <div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-violet-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-violet-900">Customer Mobile Known</p>
                    <p className="text-xs text-violet-700">
                      +91 {effectiveItem?.customerMobile} —{" "}
                      <span className="font-bold">raising as Customer Complaint</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Not sold / in transit */}
              {!effectiveCustomer && !hasCustomerMobile && effectiveItem && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-2">
                  <Package className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800">
                    {effectiveShipment?.status !== "Delivered"
                      ? "Item is in transit — "
                      : "Item not yet sold to a customer — "}
                    <span className="font-bold">raising as Self Complaint</span>
                  </p>
                </div>
              )}
            </>
          )}

          {/* ── GENERIC MODE with orderId — order / shipment context ── */}
          {entryMode === "generic" && orderId && order && (
            <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                {level === "shipment" ? "Shipment Context" : "Order Context"}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {level === "shipment"
                    ? <Truck className="w-4 h-4 text-primary" />
                    : <Package className="w-4 h-4 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold font-mono">
                    {level === "shipment" ? (shipment?.id ?? shipmentId) : orderId}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {level === "shipment"
                      ? `${shipment?.items.length ?? 0} items · ${shipment?.status ?? ""}`
                      : `${order.shipments.reduce((n, s) => n + s.items.length, 0)} items · ${order.status}`}
                  </p>
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                  level === "shipment"
                    ? statusBadge(shipment?.status ?? "")
                    : orderStatusBadge(order.status)
                }`}>
                  {level === "shipment" ? shipment?.status : order.status}
                </span>
              </div>
            </div>
          )}

          {/* ── Service Details card — shown when raising complaint against a service request ── */}
          {relatedTicketData && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 space-y-3">
              {/* Header */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-3.5 h-3.5 text-orange-600" />
                </div>
                <p className="text-xs font-bold text-orange-900 flex-1">Related Service Request</p>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${ticketStatusBadge(relatedTicketData.status)}`}>
                  {relatedTicketData.status}
                </span>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Ticket ID</p>
                  <p className="text-[11px] font-mono font-bold text-foreground mt-0.5">{relatedTicketData.id}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Assigned To</p>
                  <p className="text-xs text-foreground mt-0.5">{relatedTicketData.assignedTo || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Category</p>
                  <p className="text-xs font-semibold text-foreground mt-0.5">{relatedTicketData.category}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sub-category</p>
                  <p className="text-xs text-foreground mt-0.5">{relatedTicketData.subcategory}</p>
                </div>
                {relatedTicketData.subSubcategory && (
                  <div className="col-span-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Issue Type</p>
                    <p className="text-xs text-foreground mt-0.5">{relatedTicketData.subSubcategory}</p>
                  </div>
                )}
                {relatedTicketData.productName && (
                  <div className="col-span-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Product</p>
                    <p className="text-xs font-semibold text-foreground mt-0.5">
                      {relatedTicketData.productName}
                      {relatedTicketData.serialNumber && (
                        <span className="font-mono font-normal text-muted-foreground"> · {relatedTicketData.serialNumber}</span>
                      )}
                    </p>
                  </div>
                )}
                <div className="col-span-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Service Date</p>
                  <p className="text-xs text-foreground mt-0.5">
                    {new Date(relatedTicketData.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                    {" · "}
                    <span className="text-muted-foreground">Last updated </span>
                    {new Date(relatedTicketData.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                  </p>
                </div>
              </div>

              {/* Complaint intent label */}
              <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-lg px-2.5 py-2">
                <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                <p className="text-[11px] text-red-800 font-medium">
                  Raising <span className="font-bold">Complaint Against Service</span> for this request
                </p>
              </div>
            </div>
          )}

          <button
            onClick={() => setStep(2)}
            disabled={!step1Ready}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-xs font-bold disabled:opacity-50"
          >
            Continue to Category
          </button>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          STEP 2 — Category / Sub / SubSub
      ════════════════════════════════════════════════════════════ */}
      {step === 2 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-foreground">Select Category</h2>

          <div className="space-y-2">
            {filteredCategories.map((cat) => (
              <button
                key={cat.category}
                onClick={() =>
                  setForm({ ...form, category: cat.category, subcategory: "", subSubcategory: "" })
                }
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                  form.category === cat.category
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <span className="text-xs font-semibold text-foreground">{cat.category}</span>
              </button>
            ))}
          </div>

          {form.category && selectedCat && (
            <>
              <h3 className="text-xs font-bold text-foreground mt-1">Subcategory</h3>
              <div className="space-y-2">
                {selectedCat.subcategories.map((sub) => (
                  <button
                    key={sub.name}
                    onClick={() => setForm({ ...form, subcategory: sub.name, subSubcategory: "" })}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                      form.subcategory === sub.name
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <span className="text-xs font-medium text-foreground">{sub.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {form.subcategory && selectedSub && (
            <>
              <h3 className="text-xs font-bold text-foreground mt-1">Issue Type</h3>
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
                Continue <ChevronRight className="inline w-3.5 h-3.5" />
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

      {/* ════════════════════════════════════════════════════════════
          STEP 3 — Description + Attachments
      ════════════════════════════════════════════════════════════ */}
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
              <p className="text-[10px] text-muted-foreground mt-0.5">Max 5MB each</p>
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

      {/* ════════════════════════════════════════════════════════════
          STEP 4 — Review & Confirm
      ════════════════════════════════════════════════════════════ */}
      {step === 4 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-foreground">Review &amp; Confirm</h2>

          {/* Ticket type banner */}
          <div className={`rounded-xl px-4 py-2.5 border ${
            ticketType === "customer"
              ? "bg-violet-50 border-violet-200"
              : "bg-blue-50 border-blue-200"
          }`}>
            <p className={`text-xs font-bold ${
              ticketType === "customer" ? "text-violet-800" : "text-blue-800"
            }`}>
              {ticketType === "customer" ? "👤 Customer Complaint" : "🏪 Self Complaint"}
            </p>
          </div>

          {/* Order + Item */}
          <div className="bg-card rounded-xl border border-border p-4 text-xs space-y-1.5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Order Details
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              <div>
                <span className="text-muted-foreground">Order: </span>
                <span className="font-mono font-bold text-foreground break-all">
                  {effectiveOrder?.id || orderId || "—"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Shipment: </span>
                <span className="font-mono font-bold text-foreground">
                  {effectiveShipment?.id || shipmentId || "—"}
                </span>
              </div>
              {effectiveItem && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Product: </span>
                  <span className="font-semibold text-foreground">{effectiveItem.name}</span>
                </div>
              )}
              {effectiveItem && (
                <div>
                  <span className="text-muted-foreground">Serial: </span>
                  <span className="font-mono font-bold text-foreground">
                    {effectiveItem.serialNumber}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Customer */}
          {(effectiveCustomer || hasCustomerMobile) && (
            <div className="bg-card rounded-xl border border-border p-4 text-xs space-y-1.5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Customer
              </p>
              {effectiveCustomer && (
                <>
                  <p>
                    <span className="text-muted-foreground">Name: </span>
                    <span className="font-semibold text-foreground">{effectiveCustomer.name}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Mobile: </span>
                    <span className="font-semibold text-foreground">+91 {effectiveCustomer.mobile}</span>
                  </p>
                </>
              )}
              {hasCustomerMobile && (
                <p>
                  <span className="text-muted-foreground">Mobile: </span>
                  <span className="font-semibold text-foreground">
                    +91 {effectiveItem?.customerMobile}
                  </span>
                </p>
              )}
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
              <span className="font-semibold text-foreground">{form.subcategory}</span>
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
              <span className="text-primary font-semibold">{form.subSubcategory}</span>
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
