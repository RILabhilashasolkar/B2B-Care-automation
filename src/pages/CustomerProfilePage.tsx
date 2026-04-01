import { useParams, Link, useNavigate } from "react-router-dom";
import { mockCustomers, mockCustomerTickets, mockOrders } from "../lib/mockData";
import {
  ArrowLeft, Package, Clock, Wrench, AlertTriangle,
  MessageSquareWarning, ChevronRight, User, Phone,
  MapPin, ShieldCheck, Mail,
} from "lucide-react";

// ── Ticket classifiers ─────────────────────────────────────────────────────
const PRODUCT_COMPLAINT_CATS = new Set([
  "Order Issues", "Delivery Issues", "Billing & Payments", "Returns & Refunds", "Returns",
]);
const SERVICE_CATS     = new Set(["Installation", "Repair & Service"]);
const COMPLAINT_CATS   = new Set(["Complaint Against Service"]);

// ── Status badge ───────────────────────────────────────────────────────────
function statusCls(status: string) {
  if (status === "Open")          return "status-open";
  if (status === "In Progress")   return "status-in-progress";
  if (status === "Awaiting Info") return "status-awaiting";
  if (status === "Resolved")      return "status-resolved";
  return "status-closed";
}

export default function CustomerProfilePage() {
  const { customerId } = useParams();
  const navigate       = useNavigate();
  const customer       = mockCustomers.find((c) => c.id === customerId);

  if (!customer)
    return <div className="text-center py-20 text-xs text-muted-foreground">Customer not found</div>;

  // All tickets for this customer (authoritative — from central list)
  const allTickets = mockCustomerTickets.filter(
    (t) => t.customerMobile === customer.mobile
  );

  return (
    <div className="space-y-3 animate-fade-in pb-4">

      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <Link
          to="/service/customer"
          className="p-2 rounded-lg hover:bg-accent transition-colors flex-shrink-0"
        >
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
        // Resolve order/shipment/item for navigation
        const resolvedOrder    = mockOrders.find((o) => o.id === p.orderId);
        const resolvedShipment = resolvedOrder?.shipments.find((s) =>
          s.items.some((i) => i.serialNumber.toLowerCase() === p.serialNumber.toLowerCase())
        );
        const resolvedItem = resolvedShipment?.items.find(
          (i) => i.serialNumber.toLowerCase() === p.serialNumber.toLowerCase()
        );

        const navBase = `customerId=${customer.id}&orderId=${p.orderId}` +
          `&itemId=${resolvedItem?.id ?? ""}&shipmentId=${resolvedShipment?.id ?? ""}`;

        // Tickets for this specific product
        const productTickets     = allTickets.filter((t) => t.serialNumber === p.serialNumber);
        const productComplaints  = productTickets.filter((t) => PRODUCT_COMPLAINT_CATS.has(t.category));
        const serviceOrders      = productTickets.filter((t) => SERVICE_CATS.has(t.category));
        const serviceComplaints  = productTickets.filter((t) => COMPLAINT_CATS.has(t.category));

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
                  <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                    SN: {p.serialNumber}
                  </p>
                  <p className="text-[10px] font-mono text-muted-foreground">
                    Order: {p.orderId}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                    p.warrantyStatus === "Active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    Warranty {p.warrantyStatus}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                    p.installationStatus === "Completed"
                      ? "bg-emerald-100 text-emerald-700"
                      : p.installationStatus === "Pending"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    Install: {p.installationStatus}
                  </span>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-center gap-4 mt-2.5">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">
                    Purchased:{" "}
                    {new Date(p.purchaseDate).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">
                    Warranty:{" "}
                    {new Date(p.warrantyExpiry).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              {/* ── Per-product Action Buttons ── */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() =>
                    navigate(`/ticket/create?${navBase}&category=Order+Issues`)
                  }
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-[10px] font-semibold hover:bg-blue-100 active:opacity-80 transition-colors"
                >
                  <AlertTriangle className="w-3 h-3" /> Raise Complaint
                </button>
                <button
                  onClick={() =>
                    navigate(`/ticket/create?${navBase}&actionType=service`)
                  }
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-teal-50 border border-teal-200 text-teal-700 rounded-lg text-[10px] font-semibold hover:bg-teal-100 active:opacity-80 transition-colors"
                >
                  <Wrench className="w-3 h-3" /> Service Request
                </button>
              </div>
            </div>

            {/* ── a. Past Product Related Complaints ── */}
            {productComplaints.length > 0 && (
              <div className="border-t border-border">
                <div className="px-4 py-2 bg-blue-50/60">
                  <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                    Product Related Complaints ({productComplaints.length})
                  </p>
                </div>
                {productComplaints.map((t) => (
                  <Link
                    key={t.id}
                    to={`/ticket/${t.id}`}
                    className="flex items-center justify-between px-4 py-2.5 border-t border-border/40 hover:bg-accent/40 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-bold text-primary">{t.id}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${statusCls(t.status)}`}>
                          {t.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-foreground truncate">
                        {t.category} → {t.subcategory}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(t.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "2-digit",
                        })}
                        {t.assignedTo ? ` · ${t.assignedTo}` : ""}
                      </p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary flex-shrink-0 ml-2" />
                  </Link>
                ))}
              </div>
            )}

            {/* ── b. Past Service Orders ── */}
            {serviceOrders.length > 0 && (
              <div className="border-t border-border">
                <div className="px-4 py-2 bg-teal-50/60">
                  <p className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                    Service Orders ({serviceOrders.length})
                  </p>
                </div>
                {serviceOrders.map((t) => (
                  <div key={t.id} className="border-t border-border/40">
                    <Link
                      to={`/ticket/${t.id}`}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-accent/40 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] font-bold text-primary">{t.id}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${statusCls(t.status)}`}>
                            {t.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-foreground truncate">
                          {t.category} → {t.subcategory}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(t.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "2-digit",
                          })}
                          {t.assignedTo ? ` · ${t.assignedTo}` : ""}
                        </p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary flex-shrink-0 ml-2" />
                    </Link>

                    {/* Quick action: raise complaint against this service */}
                    {t.status !== "Resolved" && t.status !== "Closed" && (
                      <button
                        onClick={() =>
                          navigate(
                            `/ticket/create?customerId=${customer.id}` +
                            `&category=Complaint+Against+Service` +
                            `&relatedTicket=${t.id}` +
                            `&serialNumber=${t.serialNumber ?? ""}`
                          )
                        }
                        className="w-full flex items-center justify-between gap-2 px-4 py-2 bg-red-50 border-t border-red-100 hover:bg-red-100 active:opacity-80 transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <MessageSquareWarning className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                          <span className="text-[10px] font-semibold text-red-700">
                            Raise Complaint Against This Service
                          </span>
                        </div>
                        <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full border border-red-200 font-semibold flex-shrink-0">
                          {t.id}
                        </span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── c. Past Complaints Against Service ── */}
            {serviceComplaints.length > 0 && (
              <div className="border-t border-border">
                <div className="px-4 py-2 bg-red-50/60">
                  <p className="text-[10px] font-bold text-red-800 uppercase tracking-wider">
                    Complaints Against Service ({serviceComplaints.length})
                  </p>
                </div>
                {serviceComplaints.map((t) => (
                  <Link
                    key={t.id}
                    to={`/ticket/${t.id}`}
                    className="flex items-center justify-between px-4 py-2.5 border-t border-border/40 hover:bg-accent/40 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-bold text-primary">{t.id}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${statusCls(t.status)}`}>
                          {t.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-foreground truncate">
                        {t.category} → {t.subcategory}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(t.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "2-digit",
                        })}
                        {t.assignedTo ? ` · ${t.assignedTo}` : ""}
                      </p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary flex-shrink-0 ml-2" />
                  </Link>
                ))}
              </div>
            )}

            {/* Empty state — no tickets for this product yet */}
            {productComplaints.length === 0 && serviceOrders.length === 0 && serviceComplaints.length === 0 && (
              <div className="border-t border-border px-4 py-3 text-center">
                <p className="text-[10px] text-muted-foreground italic">No tickets raised for this product yet</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
