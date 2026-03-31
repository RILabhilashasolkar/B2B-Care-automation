import { useState } from "react";
import { Search, ArrowLeft, Package, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { mockOrders, type ServiceOrder, type ServiceOrderStatus } from "../lib/mockData";

const statusColor: Record<ServiceOrderStatus, string> = {
  "Open": "status-open",
  "Engineer Visit Pending": "status-in-progress",
  "Engineer On the Way": "bg-accent/20 text-accent-foreground",
  "Closed": "status-resolved",
};

const statusSteps: ServiceOrderStatus[] = ["Open", "Engineer Visit Pending", "Engineer On the Way", "Closed"];

export default function ServiceOrderLookupPage() {
  const [searchType, setSearchType] = useState<"so" | "mobile">("so");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Array<{ so: ServiceOrder; itemName: string; orderId: string; sku: string; serialNumber: string }>>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearched(true);

    const found: typeof results = [];
    mockOrders.forEach((order) => {
      order.shipments.forEach((shipment) => {
        shipment.items.forEach((item) => {
          if (!item.serviceOrder) return;
          const so = item.serviceOrder;
          if (searchType === "so" && so.id.toLowerCase().includes(query.toLowerCase())) {
            found.push({ so, itemName: item.name, orderId: order.id, sku: item.sku, serialNumber: item.serialNumber });
          }
          if (searchType === "mobile" && so.customerMobile.includes(query)) {
            found.push({ so, itemName: item.name, orderId: order.id, sku: item.sku, serialNumber: item.serialNumber });
          }
        });
      });
    });
    setResults(found);
  };

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to="/" className="p-2 rounded-lg hover:bg-accent transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-base font-bold text-foreground">Service Order Lookup</h1>
          <p className="text-sm text-muted-foreground">Check service order status in real-time</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-card rounded-xl border border-border p-5 space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => { setSearchType("so"); setQuery(""); setSearched(false); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              searchType === "so" ? "bg-primary text-primary-foreground" : "bg-accent text-foreground"
            }`}
          >
            <Package className="w-4 h-4" /> By SO Number
          </button>
          <button
            onClick={() => { setSearchType("mobile"); setQuery(""); setSearched(false); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              searchType === "mobile" ? "bg-primary text-primary-foreground" : "bg-accent text-foreground"
            }`}
          >
            <Phone className="w-4 h-4" /> By Mobile Number
          </button>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={searchType === "so" ? "Enter Service Order number (e.g. SO-2024-0001)" : "Enter customer mobile number"}
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button onClick={handleSearch} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
            Search
          </button>
        </div>
      </div>

      {/* Results */}
      {searched && results.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">No service orders found</p>
          <p className="text-sm mt-1">Try a different search term</p>
        </div>
      )}

      {results.map((r) => (
        <div key={r.so.id} className="bg-card rounded-xl border border-border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-foreground">{r.so.id}</p>
              <p className="text-sm text-muted-foreground">{r.itemName}</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[r.so.status]}`}>
              {r.so.status}
            </span>
          </div>

          {/* Status Progress Bar */}
          <div className="flex items-center gap-1">
            {statusSteps.map((step, i) => {
              const currentIndex = statusSteps.indexOf(r.so.status);
              const isCompleted = i <= currentIndex;
              return (
                <div key={step} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className={`h-1.5 w-full rounded-full ${isCompleted ? "bg-primary" : "bg-border"}`} />
                  <span className={`text-[10px] text-center ${isCompleted ? "text-primary font-medium" : "text-muted-foreground"}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground">Order:</span> <Link to={`/orders/${r.orderId}`} className="text-primary hover:underline">{r.orderId}</Link></div>
            <div><span className="text-muted-foreground">Customer:</span> <span className="text-foreground">+91{r.so.customerMobile}</span></div>
            <div><span className="text-muted-foreground">SKU:</span> <span className="text-foreground">{r.sku}</span></div>
            <div><span className="text-muted-foreground">Serial:</span> <span className="text-foreground">{r.serialNumber}</span></div>
            <div><span className="text-muted-foreground">Created:</span> <span className="text-foreground">{new Date(r.so.createdAt).toLocaleDateString("en-IN")}</span></div>
            <div><span className="text-muted-foreground">Updated:</span> <span className="text-foreground">{new Date(r.so.updatedAt).toLocaleDateString("en-IN")}</span></div>
          </div>
        </div>
      ))}
    </div>
  );
}
