import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Search, X, SlidersHorizontal, Package,
  Wrench, Phone, CheckCircle, Calendar,
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

type DateRangeOption = "7" | "30" | "90" | "all";

interface InstallFilters {
  brands: string[];
  productFamilies: string[];
  productDetails: string[];
  dateRange: DateRangeOption;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const EMPTY_FILTERS: InstallFilters = {
  brands: [],
  productFamilies: [],
  productDetails: [],
  dateRange: "all",
};

const AC_DETAIL_CHIPS = ["1 Ton", "1.5 Ton", "2 Ton", "Split AC", "Window AC"];

const DATE_RANGE_OPTIONS: Array<{ value: DateRangeOption; label: string }> = [
  { value: "7",   label: "Last 7 days"  },
  { value: "30",  label: "Last 30 days" },
  { value: "90",  label: "Last 90 days" },
  { value: "all", label: "All time"     },
];

// ── Toggle chip helper ────────────────────────────────────────────────────────
function toggleChip<T extends string>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

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
function ServiceLinkModal({
  item,
  mobile,
  mobileError,
  onMobileChange,
  onClose,
  onSubmit,
}: {
  item: OrderItem;
  mobile: string;
  mobileError: string;
  onMobileChange: (v: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const inputCls =
    "w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <div
      className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl border border-border p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground">Send Service Link</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-accent transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 mb-4">
          <p className="text-xs font-semibold text-green-900 truncate">{item.name}</p>
          <p className="text-[10px] font-mono text-green-700 mt-0.5">SN: {item.serialNumber}</p>
        </div>

        <p className="text-xs text-muted-foreground mb-3">
          Send a WhatsApp/SMS link so the customer can register their product and book installation.
        </p>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            Customer Mobile *
          </label>
          <input
            value={mobile}
            onChange={(e) => onMobileChange(e.target.value)}
            placeholder="10-digit mobile"
            maxLength={10}
            className={inputCls}
          />
          {mobileError && (
            <p className="text-[10px] text-red-600 mt-1">{mobileError}</p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onSubmit}
            disabled={!mobile}
            className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Phone className="w-3.5 h-3.5" />
            Send Link
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

  // ── Product pool: delivered + installationEligible ────────────────────────
  const productPool: PoolItem[] = mockOrders.flatMap((order) =>
    order.shipments
      .filter((s) => s.status === "Delivered")
      .flatMap((shipment) =>
        shipment.items
          .filter((item) => item.installationEligible)
          .map((item) => ({ order, shipment, item }))
      )
  );

  // ── Derived filter options (from pool) ────────────────────────────────────
  const availableBrands = [...new Set(productPool.map((p) => p.item.brand))];
  const availableFamilies = [...new Set(productPool.map((p) => p.item.productFamily))];

  const showAcDetails =
    draft.productFamilies.length === 0 ||
    draft.productFamilies.includes("Air Conditioner");

  const showAcDetailsApplied =
    applied.productFamilies.length === 0 ||
    applied.productFamilies.includes("Air Conditioner");

  // ── Filter logic ──────────────────────────────────────────────────────────
  const searchTrimmed = search.trim().toLowerCase();

  const filtered = productPool.filter((p) => {
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
    if (applied.brands.length > 0 && !applied.brands.includes(p.item.brand)) return false;

    // Family filter
    if (applied.productFamilies.length > 0 && !applied.productFamilies.includes(p.item.productFamily))
      return false;

    // Product detail (AC sub-filter)
    if (applied.productDetails.length > 0) {
      const nameLower = p.item.name.toLowerCase();
      const detailMatch = applied.productDetails.some((detail) => {
        switch (detail) {
          case "1 Ton":    return nameLower.includes("1 ton") && !nameLower.includes("1.5");
          case "1.5 Ton":  return nameLower.includes("1.5 ton");
          case "2 Ton":    return nameLower.includes("2 ton");
          case "Split AC": return nameLower.includes("split");
          case "Window AC":return nameLower.includes("window");
          default:         return false;
        }
      });
      if (!detailMatch) return false;
    }

    // Date range filter
    if (applied.dateRange !== "all") {
      const days = parseInt(applied.dateRange, 10);
      const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const deliveryDate = new Date(p.shipment.deliveryDate);
      if (deliveryDate < cutoff) return false;
    }

    return true;
  });

  // ── Active filter count ───────────────────────────────────────────────────
  const activeFilterCount =
    applied.brands.length +
    applied.productFamilies.length +
    applied.productDetails.length +
    (applied.dateRange !== "all" ? 1 : 0);

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

  const handleLinkSubmit = () => {
    if (!modalItemId) return;
    if (!/^[6-9]\d{9}$/.test(modalMobile)) {
      setModalMobileError("Enter a valid 10-digit Indian mobile number");
      return;
    }
    setServiceLinksSent((prev) => ({ ...prev, [modalItemId]: modalMobile }));
    alert(`✅ Service link sent to +91 ${modalMobile}`);
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
          {productPool.length} eligible
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
          {applied.brands.map((b) => (
            <button
              key={b}
              onClick={() => setApplied((prev) => ({ ...prev, brands: prev.brands.filter((v) => v !== b) }))}
              className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-[10px] font-semibold rounded-full"
            >
              {b} <X className="w-2.5 h-2.5" />
            </button>
          ))}
          {applied.productFamilies.map((f) => (
            <button
              key={f}
              onClick={() => setApplied((prev) => ({ ...prev, productFamilies: prev.productFamilies.filter((v) => v !== f) }))}
              className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-[10px] font-semibold rounded-full"
            >
              {f} <X className="w-2.5 h-2.5" />
            </button>
          ))}
          {applied.productDetails.map((d) => (
            <button
              key={d}
              onClick={() => setApplied((prev) => ({ ...prev, productDetails: prev.productDetails.filter((v) => v !== d) }))}
              className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-[10px] font-semibold rounded-full"
            >
              {d} <X className="w-2.5 h-2.5" />
            </button>
          ))}
          {applied.dateRange !== "all" && (
            <button
              onClick={() => setApplied((prev) => ({ ...prev, dateRange: "all" }))}
              className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-[10px] font-semibold rounded-full"
            >
              <Calendar className="w-2.5 h-2.5" />
              {DATE_RANGE_OPTIONS.find((o) => o.value === applied.dateRange)?.label}
              <X className="w-2.5 h-2.5" />
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
            {applied.dateRange !== "all"
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
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <p className="text-sm font-bold text-foreground">Filters</p>
              <button
                onClick={() => setShowFilterSheet(false)}
                className="p-1.5 rounded-lg hover:bg-accent transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Filter content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

              {/* Brand */}
              <div>
                <p className="text-xs font-bold text-foreground mb-2">Brand</p>
                <div className="flex flex-wrap gap-2">
                  {availableBrands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setDraft((prev) => ({ ...prev, brands: toggleChip(prev.brands, brand) }))}
                      className={`px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-all ${
                        draft.brands.includes(brand)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-foreground border-border hover:border-primary/30"
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Family */}
              <div>
                <p className="text-xs font-bold text-foreground mb-2">Product Family</p>
                <div className="flex flex-wrap gap-2">
                  {availableFamilies.map((family) => (
                    <button
                      key={family}
                      onClick={() => setDraft((prev) => ({ ...prev, productFamilies: toggleChip(prev.productFamilies, family) }))}
                      className={`px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-all ${
                        draft.productFamilies.includes(family)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-foreground border-border hover:border-primary/30"
                      }`}
                    >
                      {family}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Details (AC sub-filter) */}
              {showAcDetails && (
                <div>
                  <p className="text-xs font-bold text-foreground mb-1">
                    AC Product Details
                    <span className="ml-1.5 text-[10px] font-normal text-muted-foreground">
                      (Air Conditioner sub-filter)
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {AC_DETAIL_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => setDraft((prev) => ({ ...prev, productDetails: toggleChip(prev.productDetails, chip) }))}
                        className={`px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-all ${
                          draft.productDetails.includes(chip)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card text-foreground border-border hover:border-primary/30"
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Date Range */}
              <div>
                <p className="text-xs font-bold text-foreground mb-2">Delivery Date Range</p>
                <div className="flex flex-wrap gap-2">
                  {DATE_RANGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setDraft((prev) => ({ ...prev, dateRange: opt.value }))}
                      className={`px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-all ${
                        draft.dateRange === opt.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-foreground border-border hover:border-primary/30"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-2 px-5 py-4 border-t border-border">
              <button
                onClick={clearFilters}
                className="flex-1 py-2.5 bg-card border border-border rounded-xl text-xs font-semibold text-foreground"
              >
                Clear All
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold"
              >
                Apply Filters
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
          onSubmit={handleLinkSubmit}
        />
      )}

    </div>
  );
}
