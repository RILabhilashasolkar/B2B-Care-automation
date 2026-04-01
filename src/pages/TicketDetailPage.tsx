import { useParams, useSearchParams, Link } from "react-router-dom";
import { mockSelfTickets, mockCustomerTickets } from "../lib/mockData";
import { ArrowLeft, Clock, User, MessageSquare } from "lucide-react";

export default function TicketDetailPage() {
  const { ticketId } = useParams();
  const [searchParams] = useSearchParams();
  const source = searchParams.get("source") || "";

  const ticket = [...mockSelfTickets, ...mockCustomerTickets].find((t) => t.id === ticketId);

  if (!ticket) return <div className="text-center py-20 text-muted-foreground">Ticket not found</div>;

  const backPath = source === "help"
    ? "/help"
    : ticket.type === "self" ? "/service/self" : "/service/customer";

  return (
    <div className="space-y-3 animate-fade-in max-w-3xl">
      <div className="flex items-center gap-3">
        <Link to={backPath} className="p-2 rounded-lg hover:bg-accent transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-foreground">{ticket.id}</h1>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold priority-${ticket.priority.toLowerCase()}`}>
              {ticket.priority}
            </span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
              ticket.status === "Open" ? "status-open" :
              ticket.status === "In Progress" ? "status-in-progress" :
              ticket.status === "Resolved" ? "status-resolved" :
              ticket.status === "Awaiting Info" ? "status-awaiting" : "status-closed"
            }`}>
              {ticket.status}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{ticket.category} → {ticket.subcategory} → {ticket.subSubcategory}</p>
        </div>
      </div>

      {/* Ticket Info */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div><span className="text-muted-foreground">Created:</span> <span className="font-medium text-foreground">{new Date(ticket.createdAt).toLocaleString("en-IN")}</span></div>
          <div><span className="text-muted-foreground">Last Updated:</span> <span className="font-medium text-foreground">{new Date(ticket.updatedAt).toLocaleString("en-IN")}</span></div>
          {ticket.assignedTo && <div><span className="text-muted-foreground">Assigned To:</span> <span className="font-medium text-foreground">{ticket.assignedTo}</span></div>}
          {ticket.orderId && <div><span className="text-muted-foreground">Order ID:</span> <span className="font-medium text-foreground">{ticket.orderId}</span></div>}
          {ticket.customerName && <div><span className="text-muted-foreground">Customer:</span> <span className="font-medium text-foreground">{ticket.customerName}</span></div>}
          {ticket.customerMobile && <div><span className="text-muted-foreground">Mobile:</span> <span className="font-medium text-foreground">{ticket.customerMobile}</span></div>}
          {ticket.productName && <div><span className="text-muted-foreground">Product:</span> <span className="font-medium text-foreground">{ticket.productName}</span></div>}
          {ticket.serialNumber && <div><span className="text-muted-foreground">Serial No:</span> <span className="font-medium text-foreground">{ticket.serialNumber}</span></div>}
        </div>
        {ticket.description && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1">Description</p>
            <p className="text-sm text-foreground">{ticket.description}</p>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div>
        <h2 className="text-sm font-bold text-foreground mb-2">Activity Timeline</h2>
        <div className="space-y-0">
          {ticket.timeline?.map((event, i) => (
            <div key={event.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  event.type === "created" ? "bg-info/10" :
                  event.type === "status_change" ? "bg-warning/10" :
                  event.type === "assigned" ? "bg-success/10" : "bg-accent"
                }`}>
                  {event.type === "created" ? <Clock className="w-4 h-4 text-info" /> :
                   event.type === "assigned" ? <User className="w-4 h-4 text-success" /> :
                   <MessageSquare className="w-4 h-4 text-muted-foreground" />}
                </div>
                {i < (ticket.timeline?.length || 0) - 1 && (
                  <div className="w-px h-8 bg-border" />
                )}
              </div>
              <div className="pb-6">
                <p className="text-xs text-foreground">{event.description}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {event.actor} · {new Date(event.timestamp).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Comment */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="text-xs font-bold text-foreground mb-2.5">Add Comment</h3>
        <textarea
          className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none placeholder:text-muted-foreground"
          rows={3}
          placeholder="Type your message..."
        />
        <div className="flex justify-end mt-2.5">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 active:opacity-80 transition-opacity">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
