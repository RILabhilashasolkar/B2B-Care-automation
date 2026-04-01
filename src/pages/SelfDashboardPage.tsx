import { Link, useNavigate } from "react-router-dom";
import { mockSelfTickets } from "../lib/mockData";
import { Plus, Search, Filter, ChevronRight } from "lucide-react";
import { useState } from "react";

const statusFilters = ["All", "Open", "In Progress", "Resolved", "Closed", "Reopen"];

export default function SelfDashboardPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  const filtered = mockSelfTickets.filter((t) => {
    const matchesSearch = t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || t.status === statusFilter ||
      (statusFilter === "Reopen" && t.status === "Reopened");
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-foreground">My Tickets</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Your purchase & billing complaints</p>
        </div>
        <button
          onClick={() => navigate("/service/self/create")}
          className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold active:opacity-80 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" />
          New
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text" placeholder="Search tickets..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Status filter chips — horizontal scroll */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 phone-scroll">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-semibold whitespace-nowrap transition-colors flex-shrink-0 ${
              statusFilter === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Ticket Stats — 4 mini cards */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Open", count: mockSelfTickets.filter((t) => t.status === "Open").length, cls: "text-blue-600" },
          { label: "In Prog.", count: mockSelfTickets.filter((t) => t.status === "In Progress").length, cls: "text-amber-600" },
          { label: "Reopen", count: mockSelfTickets.filter((t) => t.status === "Reopened").length, cls: "text-orange-600" },
          { label: "Resolved", count: mockSelfTickets.filter((t) => t.status === "Resolved").length, cls: "text-green-700" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-lg border border-border p-2 text-center">
            <p className={`text-lg font-bold ${s.cls}`}>{s.count}</p>
            <p className="text-[9px] font-medium text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tickets List */}
      <div className="bg-card rounded-xl border border-border divide-y divide-border">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-xs text-muted-foreground">No tickets found</div>
        ) : (
          filtered.map((ticket) => (
            <Link
              key={ticket.id}
              to={`/ticket/${ticket.id}`}
              className="flex items-center justify-between px-3 py-3 active:bg-accent/10 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[11px] font-bold text-primary">{ticket.id}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold priority-${ticket.priority.toLowerCase()}`}>
                    {ticket.priority}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                    ticket.status === "Open" ? "status-open" :
                    ticket.status === "In Progress" ? "status-in-progress" :
                    ticket.status === "Resolved" ? "status-resolved" :
                    ticket.status === "Awaiting Info" ? "status-awaiting" :
                    ticket.status === "Reopened" ? "status-open" : "status-closed"
                  }`}>
                    {ticket.status}
                  </span>
                </div>
                <p className="text-xs font-medium text-foreground truncate">{ticket.category} → {ticket.subcategory}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{ticket.description}</p>
                {ticket.status === "Closed" && (
                  <p className="text-[10px] text-muted-foreground mt-0.5 italic">Closed: Issue resolved and confirmed by retailer.</p>
                )}
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {new Date(ticket.createdAt).toLocaleDateString("en-IN")}
                  {ticket.assignedTo && ` · ${ticket.assignedTo}`}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-2 flex-shrink-0" />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
