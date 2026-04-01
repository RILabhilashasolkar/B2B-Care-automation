import { Link, useNavigate } from "react-router-dom";
import { mockCustomerTickets, mockCustomers } from "../lib/mockData";
import { Plus, Search, ChevronRight, Phone, Hash, Wrench, X } from "lucide-react";
import { useState } from "react";

export default function CustomerDashboardPage() {
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState<"mobile" | "serial" | "ticket">("mobile");
  const [searchResult, setSearchResult] = useState<typeof mockCustomers[0] | null>(null);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    setSearched(true);
    if (searchType === "mobile") {
      setSearchResult(mockCustomers.find((c) => c.mobile.includes(search)) || null);
    } else if (searchType === "serial") {
      setSearchResult(
        mockCustomers.find((c) =>
          c.purchases.some((p) => p.serialNumber.toLowerCase().includes(search.toLowerCase()))
        ) || null
      );
    } else {
      setSearchResult(null);
    }
  };

  const ticketSearchResult = searchType === "ticket" && searched
    ? mockCustomerTickets.filter((t) => t.id.toLowerCase().includes(search.toLowerCase()))
    : [];

  const displayTickets = mockCustomerTickets;

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-foreground">My Customer — Service Hub</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Raise and track service requests on behalf of your customers</p>
        </div>
        <button
          onClick={() => navigate("/help/complaint?tab=customer")}
          className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold active:opacity-80 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" />
          New Ticket
        </button>
      </div>

      {/* Customer Search */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="text-xs font-bold text-foreground mb-2.5">Find Customer</h3>

        {/* Search type chips */}
        <div className="flex gap-1.5 mb-3 overflow-x-auto phone-scroll pb-0.5">
          {([
            { key: "mobile", label: "Mobile Number", icon: Phone },
            { key: "serial", label: "Serial Number", icon: Hash },
            { key: "ticket", label: "Ticket #",      icon: Hash },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setSearchType(key); setSearch(""); setSearched(false); }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-semibold whitespace-nowrap flex-shrink-0 transition-colors ${
                searchType === key
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground"
              }`}
            >
              <Icon className="w-3 h-3" /> {label}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={
                searchType === "mobile" ? "Enter 10-digit mobile number..." :
                searchType === "serial" ? "Enter product serial number..." :
                "Enter ticket number..."
              }
              value={search}
              onChange={(e) => { setSearch(e.target.value); setSearched(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-8 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground"
            />
            {search && (
              <button
                onClick={() => { setSearch(""); setSearched(false); setSearchResult(null); }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 active:opacity-80 transition-opacity"
          >
            Search
          </button>
        </div>

        {/* Search Result — customer */}
        {searched && searchType !== "ticket" && searchResult && (
          <Link
            to={`/service/customer/${searchResult.id}`}
            className="mt-3 block bg-accent/50 rounded-xl p-3.5 hover:bg-accent transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">{searchResult.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{searchResult.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{searchResult.mobile} · {searchResult.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">{searchResult.purchases.length} product(s)</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              </div>
            </div>
          </Link>
        )}

        {searched && searchType !== "ticket" && !searchResult && (
          <div className="mt-3 bg-muted/50 rounded-xl p-3.5 text-center">
            <p className="text-xs text-muted-foreground">No customer found. Create a ticket from Create Complaint.</p>
            <button
              onClick={() => navigate("/help/complaint?tab=customer")}
              className="mt-2 text-xs text-primary font-semibold hover:underline"
            >
              + Create New Customer Ticket
            </button>
          </div>
        )}

        {/* Search Result — ticket */}
        {searched && searchType === "ticket" && ticketSearchResult.length > 0 && (
          <div className="mt-3 space-y-2">
            {ticketSearchResult.map((ticket) => (
              <Link
                key={ticket.id}
                to={`/ticket/${ticket.id}`}
                className="block bg-accent/50 rounded-xl p-3 hover:bg-accent transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-primary">{ticket.id}</p>
                    <p className="text-xs text-foreground mt-0.5">{ticket.customerName} — {ticket.category}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{ticket.status}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {searched && searchType === "ticket" && ticketSearchResult.length === 0 && (
          <div className="mt-3 bg-muted/50 rounded-xl p-3.5 text-center">
            <p className="text-xs text-muted-foreground">No tickets found with that ID.</p>
          </div>
        )}
      </div>

      {/* All Tickets */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-foreground">All Tickets ({displayTickets.length})</h3>
        </div>
        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          {displayTickets.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-muted-foreground">
              No tickets yet. Create one from Create Complaint.
            </div>
          ) : (
            displayTickets.map((ticket) => (
              <Link
                key={ticket.id}
                to={`/ticket/${ticket.id}`}
                className="flex items-center justify-between px-3 py-3 hover:bg-accent/50 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className="text-[11px] font-bold text-primary">{ticket.id}</span>
                    {ticket.category === "Installation" && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold bg-primary/10 text-primary">
                        <Wrench className="w-2.5 h-2.5 inline mr-0.5" />Install
                      </span>
                    )}
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold priority-${ticket.priority.toLowerCase()}`}>
                      {ticket.priority}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                      ticket.status === "Open"          ? "status-open" :
                      ticket.status === "In Progress"   ? "status-in-progress" :
                      ticket.status === "Awaiting Info" ? "status-awaiting" :
                      ticket.status === "Resolved"      ? "status-resolved" : "status-closed"
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-foreground truncate">{ticket.customerName} — {ticket.category} → {ticket.subcategory}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{ticket.productName} · {ticket.serialNumber}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Created {new Date(ticket.createdAt).toLocaleDateString("en-IN")} · {ticket.assignedTo}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-3 flex-shrink-0" />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
