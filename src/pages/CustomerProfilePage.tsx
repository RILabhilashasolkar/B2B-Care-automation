import { useParams, Link, useNavigate } from "react-router-dom";
import { mockCustomers } from "../lib/mockData";
import { ArrowLeft, Shield, Package, Clock, Wrench, AlertTriangle, MessageSquare } from "lucide-react";

export default function CustomerProfilePage() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const customer = mockCustomers.find((c) => c.id === customerId);

  if (!customer) return <div className="text-center py-20 text-muted-foreground">Customer not found</div>;

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to="/service/customer" className="p-2 rounded-lg hover:bg-accent transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div className="flex-1">
          <h1 className="text-base font-bold text-foreground">{customer.name}</h1>
          <p className="text-sm text-muted-foreground">{customer.mobile} · {customer.city} · {customer.pincode}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Installation Request", icon: Wrench, action: () => navigate("/orders"), highlight: true },
          { label: "Raise Complaint", icon: AlertTriangle, action: () => navigate("/orders") },
          { label: "Service Request", icon: Wrench, action: () => navigate("/orders") },
          { label: "Complaint Against Service", icon: MessageSquare, action: () => navigate("/orders") },
        ].map((a) => (
          <button
            key={a.label}
            onClick={a.action}
            className={`rounded-xl border p-4 text-center hover:shadow-md transition-all ${
              'highlight' in a && a.highlight
                ? "bg-primary/5 border-primary/30 hover:border-primary/50"
                : "bg-card border-border hover:border-primary/30"
            }`}
          >
            <a.icon className={`w-5 h-5 mx-auto mb-2 ${'highlight' in a && a.highlight ? "text-primary" : "text-primary"}`} />
            <p className="text-xs font-medium text-foreground">{a.label}</p>
          </button>
        ))}
      </div>

      {/* Purchase History */}
      <div>
        <h2 className="text-sm font-bold text-foreground mb-2">Purchase History & Warranty</h2>
        <div className="space-y-3">
          {customer.purchases.map((p) => (
            <div key={p.id} className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{p.productName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">SN: {p.serialNumber} · Order: {p.orderId}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Purchased: {new Date(p.purchaseDate).toLocaleDateString("en-IN")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Warranty: {new Date(p.warrantyExpiry).toLocaleDateString("en-IN")}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    p.warrantyStatus === "Active" ? "status-resolved" : "status-awaiting"
                  }`}>
                    Warranty {p.warrantyStatus}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    p.installationStatus === "Completed" ? "status-resolved" :
                    p.installationStatus === "Pending" ? "status-in-progress" : "status-closed"
                  }`}>
                    Install: {p.installationStatus}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket History */}
      <div>
        <h2 className="text-sm font-bold text-foreground mb-2">Ticket History</h2>
        {customer.tickets.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
            No tickets found for this customer
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            {customer.tickets.map((ticket) => (
              <Link
                key={ticket.id}
                to={`/ticket/${ticket.id}`}
                className="flex items-center justify-between px-3 py-3 hover:bg-accent/50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-primary">{ticket.id}</span>
                    {ticket.category === "Installation" && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-primary/10 text-primary">
                        <Wrench className="w-2.5 h-2.5 inline mr-0.5" /> Install
                      </span>
                    )}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      ticket.status === "Open" ? "status-open" : ticket.status === "In Progress" ? "status-in-progress" : "status-resolved"
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{ticket.category} → {ticket.subcategory}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{ticket.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
