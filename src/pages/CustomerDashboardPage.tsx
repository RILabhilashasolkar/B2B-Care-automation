import { Link, useNavigate } from "react-router-dom";
import { mockCustomerTickets, mockCustomers } from "../lib/mockData";
import { Plus, Search, ChevronRight, Phone, Hash, Wrench } from "lucide-react";
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-foreground">My Customer — Service Hub</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Raise and track service requests on behalf of your customers</p>
        </div>
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold"
        >
          <Plus className="w-3.5 h-3.5" />
          New Ticket
        </button>
      </div>

      {/* Customer Search */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Find Customer</h3>
        <div className="flex gap-2 mb-3 flex-wrap">
          <button
            onClick={() => { setSearchType("mobile"); setSearch(""); setSearched(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              searchType === "mobile" ? "bg-primary text-primary-foreground" : "bg-accent text-foreground"
            }`}
          >
            <Phone className="w-3 h-3" /> Mobile Number
          </button>
          <button
            onClick={() => { setSearchType("serial"); setSearch(""); setSearched(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              searchType === "serial" ? "bg-primary text-primary-foreground" : "bg-accent text-foreground"
            }`}
          >
            <Hash className="w-3 h-3" /> Serial Number
          </button>
          <button
            onClick={() => { setSearchType("ticket"); setSearch(""); setSearched(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              searchType === "ticket" ? "bg-primary text-primary-foreground" : "bg-accent text-foreground"
            }`}
          >
            <Hash className="w-3 h-3" /> Ticket #
          </button>
        </div>
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
              value={search} onChange={(e) => { setSearch(e.target.value); setSearched(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button onClick={handleSearch} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            Search
          </button>
        </div>

        {/* Search Result — customer */}
        {searched && searchType !== "ticket" && searchResult && (
          <Link
            to={`/service/customer/${searchResult.id}`}
            className="mt-4 block bg-accent/50 rounded-lg p-4 hover:bg-accent transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">{searchResult.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{searchResult.name}</p>
                  <p className="text-xs text-muted-foreground">{searchResult.mobile} · {searchResult.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{searchResult.purchases.length} product(s)</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              </div>
            </div>
          </Link>
        )}
        {searched && searchType !== "ticket" && !searchResult && (
          <div className="mt-4 bg-accent/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">No customer found. The customer record will be created when you raise an installation request.</p>
            <button
              onClick={() => navigate("/orders")}
              className="mt-2 text-sm text-primary font-medium hover:underline"
            >
              + Create New Customer Ticket
            </button>
          </div>
        )}

        {/* Search Result — ticket */}
        {searched && searchType === "ticket" && ticketSearchResult.length > 0 && (
          <div className="mt-4 space-y-2">
            {ticketSearchResult.map((ticket) => (
              <Link
                key={ticket.id}
                to={`/ticket/${ticket.id}`}
                className="block bg-accent/50 rounded-lg p-3 hover:bg-accent transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-primary">{ticket.id}</p>
                    <p className="text-xs text-foreground mt-0.5">{ticket.customerName} — {ticket.category}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{ticket.status}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                </div>
              </Link>
            ))}
          </div>
        )}
        {searched && searchType === "ticket" && ticketSearchResult.length === 0 && (
          <div className="mt-4 bg-accent/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">No tickets found with that ID.</p>
          </div>
        )}
      </div>

      {/* All Tickets */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">All Tickets ({displayTickets.length})</h3>
        </div>
        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          {displayTickets.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
              No tickets yet. Create one from My Orders → Order → Item.
            </div>
          ) : (
            displayTickets.map((ticket) => (
              <Link
                key={ticket.id}
                to={`/ticket/${ticket.id}`}
                className="flex items-center justify-between px-3 py-3 hover:bg-accent/50 transition-colors group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-primary">{ticket.id}</span>
                    {ticket.category === "Installation" && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-primary/10 text-primary">
                        <Wrench className="w-2.5 h-2.5 inline mr-0.5" /> Install
                      </span>
                    )}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium priority-${ticket.priority.toLowerCase()}`}>
                      {ticket.priority}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      ticket.status === "Open" ? "status-open" :
                      ticket.status === "In Progress" ? "status-in-progress" :
                      ticket.status === "Awaiting Info" ? "status-awaiting" :
                      ticket.status === "Resolved" ? "status-resolved" : "status-closed"
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{ticket.customerName} — {ticket.category} → {ticket.subcategory}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{ticket.productName} · {ticket.serialNumber}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Created {new Date(ticket.createdAt).toLocaleDateString("en-IN")} · {ticket.assignedTo}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-4" />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
