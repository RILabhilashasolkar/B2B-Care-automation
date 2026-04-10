import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Search, X, SlidersHorizontal, Package,
  Wrench, Phone, CheckCircle, Calendar, MessageCircle, ChevronDown,
} from "lucide-react";
import {
  mockOrders,
  type Order, type Shipment, type OrderItem,
} from "../lib/mockData";

// ── Types ─────────────────────────────────────────────────────────────────────
interface PoolItem {
  order: Order;
  shipment: Shipment;
  item: OrderItem;
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

interface InstallFilters {
  brand: string;
  productFamily: string;
  productDetail: string;
  dateFrom: string;
  dateTo: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const EMPTY_FILTERS: InstallFilters = {
  brand: "",
  productFamily: "",
  productDetail: "",
  dateFrom: "",
  dateTo: "",
};

// Product detail options — per brand × product family (cascading)
const PRODUCT_DETAIL_MAP: Record<string, Record<string, string[]>> = {
  Samsung: {
    Television:       ["Crystal UHD", "QLED", "4K", "Full HD"],
  },
  LG: {
    "Air Conditioner": ["1 Ton", "1.5 Ton", "2 Ton", "Split AC", "Window AC", "Inverter AC"],
  },
  Whirlpool: {
    Refrigerator:     ["Single Door", "Double Door", "Frost Free", "Direct Cool"],
  },
  Havells: {
    Fan:              ["Ceiling Fan", "Table Fan", "Wall Fan", "Exhaust Fan"],
  },
};

// ── CreateInstallationModal ───────────────────────────────────────────────────
function CreateInstallationModal({
  item,
  onClose,
  onSubmit,
}: {
  item: OrderItem;
  onClose: () => void;
  onSubmit: (data: InstallFormData) => void;
}) {
  const [form, setForm] = useState<InstallFormData>({
    customerName: "",
    mobile: "",
    address: "",
    city: "",
    pincode: "",
    preferredDate: "",
    notes: "",
  });
  const [mobileError, setMobileError] = useState<string>("");

  const inputCls =
    "w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/40";

  const handleSubmit = () => {
    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      setMobileError("Enter a valid 10-digit Indian mobile number");
      return;
    }
    onSubmit(form);
  };

  const isValid =
    form.customerName.trim() &&
    form.mobile.trim() &&
    form.address.trim() &&
    form.city.trim() &&
    form.pincode.trim();

  return (
    <div
      className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl border border-border p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground">Raise Installation Request</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-accent transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Product info */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 mb-4">
          <p className="text-xs font-semibold text-foreground">{item.name}</p>
          <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
            SN: {item.serialNumber}
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Customer Name *
            </label>
            <input
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              placeholder="Full name"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Mobile Number *
            </label>
            <input
              value={form.mobile}
              onChange={(e) => { setForm({ ...form, mobile: e.target.value }); setMobileError(""); }}
              placeholder="10-digit mobile"
              maxLength={10}
              className={inputCls}
            />
            {mobileError && (
              <p className="text-[10px] text-red-600 mt-1">{mobileError}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Installation Address *
            </label>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Street address"
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                City *
              </label>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="City"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Pincode *
              </label>
              <input
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                placeholder="6-digit"
                maxLength={6}
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Preferred Date
            </label>
            <input
              type="date"
              value={form.preferredDate}
              onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Notes (optional)
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any special instructions..."
              rows={2}
              className={inputCls + " resize-none"}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Submit Request
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-card border border-border rounded-xl text-xs font-semibold text-foreground"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Service Link Modal ────────────────────────────────────────────────────────
// ── Booking URL builder ───────────────────────────────────────────────────
const RETAILER_NAME = "Kumar Electronics & Appliances";
const APP_BASE      = "https://rilabhilashasolkar.github.io/B2B-Care-automation/#/install/book";

function buildBookingUrl(item: OrderItem, mobile: string): string {
  const p = new URLSearchParams({
    p: item.name,
    s: item.serialNumber,
    m: mobile,
  });
  return `${APP_BASE}?${p.toString()}`;
}

function buildWaMessage(item: OrderItem, bookingUrl: string): string {
  return (
    `Hi! 🎉\n\n` +
    `Thank you for shopping at *${RETAILER_NAME}* 🏪\n\n` +
    `Your product is ready for *FREE Installation*:\n\n` +
    `📦 *${item.name}*\n` +
    `🔢 Serial No: ${item.serialNumber}\n\n` +
    `Book your installation in just *2 minutes* 👇\n\n` +
    `${bookingUrl}\n\n` +
    `_Powered by JioMart Digital_ 💙`
  );
}

function buildSmsMessage(item: OrderItem, bookingUrl: string): string {
  return (
    `Hi! Your ${item.name} (SN: ${item.serialNumber}) from ${RETAILER_NAME} is ready for FREE installation. ` +
    `Book here: ${bookingUrl} — JioMart Digital`
  );
}

function ServiceLinkModal({
  item,
  mobile,
  mobileError,
  onMobileChange,
  onClose,
  onWhatsApp,
  onSms,
}: {
  item: OrderItem;
  mobile: string;
  mobileError: string;
  onMobileChange: (v: string) => void;
  onClose: () => void;
  onWhatsApp: () => void;
  onSms: () => void;
}) {
  const inputCls =
    "w-full px-3 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <div
      className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl border border-border p-5 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground">Send Service Link</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-accent transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Product chip */}
        <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2.5 mb-4">
          <p className="text-xs font-bold text-green-900">{item.name}</p>
          <p className="text-[10px] font-mono text-green-700 mt-0.5">SN: {item.serialNumber}</p>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
          Send a personalised WhatsApp/SMS message with a booking link so your customer can schedule their FREE installation in minutes.
        </p>

        {/* Mobile input */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Customer Mobile <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-semibold flex-shrink-0 bg-muted px-2.5 py-2 rounded-xl">+91</span>
            <input
              value={mobile}
              onChange={(e) => onMobileChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="10-digit mobile"
              maxLength={10}
              className={inputCls}
            />
          </div>
          {mobileError && <p className="text-[10px] text-red-600 mt-1">{mobileError}</p>}
        </div>

        {/* What they'll receive preview */}
        {mobile.length === 10 && (
          <div className="bg-muted/40 rounded-xl px-3 py-2.5 mb-4 border border-border">
            <p className="text-[10px] font-semibold text-muted-foreground mb-1">Preview message</p>
            <p className="text-[10px] text-foreground leading-relaxed">
              Hi! 🎉 Thank you for shopping at <span className="font-bold">Kumar Electronics</span>. Book your FREE installation for <span className="font-bold">{item.name}</span> »
            </p>
          </div>
        )}

        {/* Send buttons */}
        <div className="flex gap-2">
          <button
            onClick={onWhatsApp}
            disabled={!mobile}
            className="flex-1 py-2.5 bg-[hsl(var(--success))] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50 active:opacity-80 transition-opacity"
          >
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
          </button>
          <button
            onClick={onSms}
            disabled={!mobile}
            className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50 active:opacity-80 transition-opacity"
          >
            <Phone className="w-3.5 h-3.5" /> SMS
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HelpInstallationPage() {
  // ── Search & filter state ─────────────────────────────────────────────────
  const [search, setSearch] = useState<string>("");
  const [showFilterSheet, setShowFilterSheet] = useState<boolean>(false);
  const [draft, setDraft] = useState<InstallFilters>(EMPTY_FILTERS);
  const [applied, setApplied] = useState<InstallFilters>(EMPTY_FILTERS);

  // ── Modal state ───────────────────────────────────────────────────────────
  const [modalItemId, setModalItemId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"install" | "link" | null>(null);
  const [modalMobile, setModalMobile] = useState<string>("");
  const [modalMobileError, setModalMobileError] = useState<string>("");

  // ── In-session install tracking ───────────────────────────────────────────
  const [installRequests, setInstallRequests] = useState<
    Record<string, { customerName: string; mobile: string }>
  >({});
  const [serviceLinksSent, setServiceLinksSent] = useState<Record<string, string>>({});

  // ── Product pool: delivered + eligible + installation NOT yet raised ────────
  // Items with installationRequested or installationNotByUs are tracked under
  // My Customers → Service Hub and are excluded here
  const productPool: PoolItem[] = mockOrders.flatMap((order) =>
    order.shipments
      .filter((s) => s.status === "Delivered")
      .flatMap((shipment) =>
        shipment.items
          .filter(
            (item) =>
              item.installationEligible &&
              !item.installationRequested &&
              !item.installationNotByUs
          )
          .map((item) => ({ order, shipment, item }))
      )
  );

  // ── Derived filter options (cascading: brand → family → detail) ─────────────
  const availableBrands = [...new Set(productPool.map((p) => p.item.brand))];

  // Product Family options depend on selected brand in draft
  const availableFamilies = [...new Set(
    (draft.brand
      ? productPool.filter((p) => p.item.brand === draft.brand)
      : productPool
    ).map((p) => p.item.productFamily)
  )];

  // Product detail options depend on selected brand + product family
  const availableDetails: string[] =
    draft.brand && draft.productFamily
      ? (PRODUCT_DETAIL_MAP[draft.brand]?.[draft.productFamily] ?? [])
      : [];
  const showProductDetail = availableDetails.length > 0;

  // ── Filter logic ──────────────────────────────────────────────────────────
  const searchTrimmed = search.trim().toLowerCase();

  const filtered = productPool.filter((p) => {
    // Exclude items for which a request was raised in this session
    if (installRequests[p.item.id]) return false;

    // Text search (show all if < 3 chars)
    if (searchTrimmed.length >= 3) {
      const textMatch =
        p.item.serialNumber.toLowerCase().includes(searchTrimmed) ||
        p.item.name.toLowerCase().includes(searchTrimmed) ||
        p.order.id.toLowerCase().includes(searchTrimmed) ||
        p.shipment.id.toLowerCase().includes(searchTrimmed);
      if (!textMatch) return false;
    }

    // Brand filter
    if (applied.brand && p.item.brand !== applied.brand) return false;

    // Family filter
    if (applied.productFamily && p.item.productFamily !== applied.productFamily) return false;

    // Product detail filter (matches against item name, works for all families)
    if (applied.productDetail) {
      const nameLower = p.item.name.toLowerCase();
      const detailLower = applied.productDetail.toLowerCase();
      // Special case: "1 Ton" must not match "1.5 Ton" items
      const matches =
        applied.productDetail === "1 Ton"
          ? nameLower.includes("1 ton") && !nameLower.includes("1.5")
          : nameLower.includes(detailLower);
      if (!matches) return false;
    }

    // Delivery date range filter
    if (applied.dateFrom && new Date(p.shipment.deliveryDate) < new Date(applied.dateFrom)) return false;
    if (applied.dateTo   && new Date(p.shipment.deliveryDate) > new Date(applied.dateTo))   return false;

    return true;
  });

  // ── Active filter count ───────────────────────────────────────────────────
  const activeFilterCount = [
    applied.brand, applied.productFamily, applied.productDetail,
    applied.dateFrom, applied.dateTo,
  ].filter(Boolean).length;

  // ── Modal resolution ──────────────────────────────────────────────────────
  const modalPoolItem = modalItemId
    ? productPool.find((p) => p.item.id === modalItemId) ?? null
    : null;

  // ── Handlers ─────────────────────────────────────────────────────────────
  const closeModal = () => {
    setModalItemId(null);
    setModalType(null);
    setModalMobile("");
    setModalMobileError("");
  };

  const handleInstallSubmit = (data: InstallFormData) => {
    if (!modalItemId) return;
    setInstallRequests((prev) => ({
      ...prev,
      [modalItemId]: { customerName: data.customerName, mobile: data.mobile },
    }));
    alert(
      `✅ Installation request created!\n\nCustomer: ${data.customerName}\nTicket: TKT-INST-${Date.now().toString().slice(-4)}`
    );
    closeModal();
  };

  const validateLinkMobile = (): boolean => {
    if (!/^[6-9]\d{9}$/.test(modalMobile)) {
      setModalMobileError("Enter a valid 10-digit Indian mobile number");
      return false;
    }
    return true;
  };

  const handleWhatsApp = () => {
    if (!modalItemId || !validateLinkMobile()) return;
    const poolItem = productPool.find((p) => p.item.id === modalItemId);
    if (!poolItem) return;
    const url = buildBookingUrl(poolItem.item, modalMobile);
    const msg = buildWaMessage(poolItem.item, url);
    window.open(`https://wa.me/91${modalMobile}?text=${encodeURIComponent(msg)}`, "_blank");
    setServiceLinksSent((prev) => ({ ...prev, [modalItemId]: modalMobile }));
    closeModal();
  };

  const handleSms = () => {
    if (!modalItemId || !validateLinkMobile()) return;
    const poolItem = productPool.find((p) => p.item.id === modalItemId);
    if (!poolItem) return;
    const url = buildBookingUrl(poolItem.item, modalMobile);
    const msg = buildSmsMessage(poolItem.item, url);
    window.open(`sms:+91${modalMobile}?body=${encodeURIComponent(msg)}`, "_blank");
    setServiceLinksSent((prev) => ({ ...prev, [modalItemId]: modalMobile }));
    closeModal();
  };

  const applyFilters = () => {
    setApplied(draft);
    setShowFilterSheet(false);
  };

  const clearFilters = () => {
    setDraft(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
    setShowFilterSheet(false);
  };

  return (
    <div className="space-y-3 animate-fade-in pb-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/help" className="p-2 rounded-lg hover:bg-accent transition-colors flex-shrink-0">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-foreground">Raise Installation Request</h1>
          <p className="text-xs text-muted-foreground">Delivered &amp; eligible products</p>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-teal-100 text-teal-700 border border-teal-200 flex-shrink-0">
          {productPool.length} pending
        </span>
      </div>

      {/* Search + Filter row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Serial no., Order ID or Shipment ID"
            className="w-full pl-9 pr-9 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
        <button
          onClick={() => {
            setDraft(applied);
            setShowFilterSheet(true);
          }}
          className={`relative flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
            activeFilterCount > 0
              ? "bg-primary/5 border-primary/30 text-primary"
              : "bg-card border-border text-foreground"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {applied.brand && (
            <button
              onClick={() => setApplied((prev) => ({ ...prev, brand: "", productFamily: "", productDetail: "" }))}
              className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-[10px] font-semibold rounded-full"
            >
              Brand: {applied.brand} <X className="w-2.5 h-2.5" />
            </button>
          )}
          {applied.productFamily && (
            <button
              onClick={() => setApplied((prev) => ({ ...prev, productFamily: "", productDetail: "" }))}
              className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-[10px] font-semibold rounded-full"
            >
              {applied.productFamily} <X className="w-2.5 h-2.5" />
            </button>
          )}
          {applied.productDetail && (
            <button
              onClick={() => setApplied((prev) => ({ ...prev, productDetail: "" }))}
              className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-[10px] font-semibold rounded-full"
            >
              {applied.productDetail} <X className="w-2.5 h-2.5" />
            </button>
          )}
          {applied.dateFrom && (
            <button
              onClick={() => setApplied((prev) => ({ ...prev, dateFrom: "" }))}
              className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-[10px] font-semibold rounded-full"
            >
              <Calendar className="w-2.5 h-2.5" /> From: {applied.dateFrom} <X className="w-2.5 h-2.5" />
            </button>
          )}
          {applied.dateTo && (
            <button
              onClick={() => setApplied((prev) => ({ ...prev, dateTo: "" }))}
              className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-[10px] font-semibold rounded-full"
            >
              <Calendar className="w-2.5 h-2.5" /> To: {applied.dateTo} <X className="w-2.5 h-2.5" />
            </button>
          )}
          <button
            onClick={clearFilters}
            className="px-2 py-1 text-[10px] font-semibold text-muted-foreground underline"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Results count */}
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
        {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        {activeFilterCount > 0 || searchTrimmed.length >= 3 ? " (filtered)" : ""}
      </p>

      {/* Results list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center">
          <Package className="w-12 h-12 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-semibold text-foreground">No products found</p>
          <p className="text-xs text-muted-foreground mt-1">
            {(applied.dateFrom || applied.dateTo)
              ? "Try a wider date range — mock deliveries are from Dec 2024"
              : "Adjust your search or filters"}
          </p>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="mt-3 text-xs text-primary font-semibold underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(({ order, shipment, item }) => {
            const isRequested = item.installationRequested || !!installRequests[item.id];
            const isNotByUs   = item.installationNotByUs;
            const linkSent    = serviceLinksSent[item.id];
            const showInstallBtn = item.installationEligible && !isRequested && !isNotByUs;
            const showLinkBtn    = !item.customerMobile && !linkSent && !isRequested;

            return (
              <div key={item.id} className="bg-card border border-border rounded-xl overflow-hidden">
                {/* Item details */}
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-teal-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-foreground leading-tight flex-1 min-w-0 truncate">
                          {item.name}
                        </p>
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 flex-shrink-0">
                          {item.brand}
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                        SN: <span className="font-bold text-foreground">{item.serialNumber}</span>
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {order.id.slice(0, 12)}…
                        </span>
                        <span className="text-muted-foreground text-[10px]">·</span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {shipment.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">
                          Delivered{" "}
                          {new Date(shipment.deliveryDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "2-digit",
                          })}
                        </span>
                        {/* Installation status badge */}
                        {isNotByUs ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full status-closed">
                            Not Ours
                          </span>
                        ) : isRequested ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full status-in-progress">
                            Requested
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full status-open">
                            Eligible
                          </span>
                        )}
                      </div>

                      {/* Install requested by info */}
                      {installRequests[item.id] && (
                        <div className="mt-2 flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1.5">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <p className="text-[10px] text-emerald-800">
                            {installRequests[item.id].customerName} · +91{" "}
                            {installRequests[item.id].mobile}
                          </p>
                        </div>
                      )}

                      {/* Service link sent */}
                      {linkSent && (
                        <div className="mt-2 flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-lg px-2.5 py-1.5">
                          <Phone className="w-3 h-3 text-green-600" />
                          <p className="text-[10px] text-green-800">
                            Link sent to +91 {linkSent}
                          </p>
                        </div>
                      )}

                      {/* Customer already registered */}
                      {item.customerMobile && !installRequests[item.id] && (
                        <div className="mt-2 flex items-center gap-1.5 bg-violet-50 border border-violet-200 rounded-lg px-2.5 py-1.5">
                          <Phone className="w-3 h-3 text-violet-600" />
                          <p className="text-[10px] text-violet-800">
                            Customer: +91 {item.customerMobile}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                {(showInstallBtn || showLinkBtn) && (
                  <div className="px-4 pb-4 space-y-2">
                    {showInstallBtn && (
                      <button
                        onClick={() => {
                          setModalItemId(item.id);
                          setModalType("install");
                        }}
                        className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        Raise Installation Request
                      </button>
                    )}
                    {showLinkBtn && (
                      <button
                        onClick={() => {
                          setModalItemId(item.id);
                          setModalType("link");
                          setModalMobile("");
                          setModalMobileError("");
                        }}
                        className="w-full py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Send Service Link
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Filter Bottom Sheet ── */}
      {showFilterSheet && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowFilterSheet(false)}
          />
          <div className="relative bg-card rounded-t-3xl shadow-2xl z-10 max-h-[82%] flex flex-col">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-border rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between px-5 py-3 border-b border-border">
              <div>
                <p className="text-sm font-bold text-foreground">Filter Products</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Filter across delivered eligible items</p>
              </div>
              <button
                onClick={() => setShowFilterSheet(false)}
                className="p-1.5 rounded-full bg-muted hover:bg-accent transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Filter content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

              {/* Row 1: Delivery Date Range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={draft.dateFrom}
                    onChange={(e) => setDraft({ ...draft, dateFrom: e.target.value })}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={draft.dateTo}
                    onChange={(e) => setDraft({ ...draft, dateTo: e.target.value })}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: Brand */}
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5">
                  Brand
                </label>
                <div className="relative">
                  <select
                    value={draft.brand}
                    onChange={(e) => setDraft({ ...draft, brand: e.target.value, productFamily: "", productDetail: "" })}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors appearance-none pr-7"
                  >
                    <option value="">All Brands</option>
                    {availableBrands.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Row 3: Product Family (options depend on brand) */}
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5">
                  Product Family
                  {draft.brand && <span className="ml-1 font-normal text-primary/70">({draft.brand})</span>}
                </label>
                <div className="relative">
                  <select
                    value={draft.productFamily}
                    onChange={(e) => setDraft({ ...draft, productFamily: e.target.value, productDetail: "" })}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors appearance-none pr-7"
                  >
                    <option value="">All Families</option>
                    {availableFamilies.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Row 4: Product Details (options depend on brand + family) */}
              {showProductDetail && (
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5">
                    Product Details
                    {draft.productFamily && (
                      <span className="ml-1.5 text-[10px] font-normal text-primary/70">({draft.productFamily})</span>
                    )}
                  </label>
                  <div className="relative">
                    <select
                      value={draft.productDetail}
                      onChange={(e) => setDraft({ ...draft, productDetail: e.target.value })}
                      className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors appearance-none pr-7"
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
                onClick={() => setDraft(EMPTY_FILTERS)}
                className="flex-1 py-3 rounded-xl border border-border text-xs font-bold text-foreground bg-background active:bg-muted transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={applyFilters}
                className="flex-2 flex-grow-[2] py-3 rounded-xl bg-primary text-white text-xs font-bold active:opacity-90 transition-opacity"
              >
                Apply Filters{activeFilterCount > 0 ? ` (${[draft.brand, draft.productFamily, draft.productDetail, draft.dateFrom, draft.dateTo].filter(Boolean).length})` : ""}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {modalType === "install" && modalPoolItem && (
        <CreateInstallationModal
          item={modalPoolItem.item}
          onClose={closeModal}
          onSubmit={handleInstallSubmit}
        />
      )}

      {modalType === "link" && modalPoolItem && (
        <ServiceLinkModal
          item={modalPoolItem.item}
          mobile={modalMobile}
          mobileError={modalMobileError}
          onMobileChange={(v) => { setModalMobile(v); setModalMobileError(""); }}
          onClose={closeModal}
          onWhatsApp={handleWhatsApp}
          onSms={handleSms}
        />
      )}

    </div>
  );
}
