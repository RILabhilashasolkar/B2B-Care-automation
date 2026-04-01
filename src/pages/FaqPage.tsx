import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown,
  Zap, Truck, RotateCcw, FileText, Wrench, HelpCircle, TicketCheck, X
} from "lucide-react";

const FAQ_DATA = [
  {
    category: "Demo & Installation",
    icon: Zap,
    color: "text-blue-600",
    bg: "bg-blue-50",
    items: [
      {
        q: "How do I book a standard installation for a new product?",
        a: "To book a standard installation, go to My Orders → tap the order → tap the item → select 'Create Installation Request'. Fill in the customer's address, preferred date and time slot, and submit. Our installation team will confirm within 24 hours.",
      },
      {
        q: "What is the standard installation timeline after delivery?",
        a: "Standard installation is typically completed within 48–72 hours of delivery for metros and 72–96 hours for tier 2/3 cities. You can track the installation status via SO Lookup using the service order number.",
      },
      {
        q: "How do I check the status of a pending installation request?",
        a: "Use the SO Lookup tab or go to Support → SO Follow-up. Enter the service order (SO) number or customer mobile number to see the current status, engineer assignment, and scheduled visit time.",
      },
      {
        q: "Can I reschedule an installation appointment?",
        a: "Yes. Open the installation service order from SO Lookup, tap 'Reschedule', select the new preferred date/time, and submit. Note that rescheduling within 4 hours of the appointment may attract a rescheduling fee.",
      },
    ],
  },
  {
    category: "Repair & Service",
    icon: Wrench,
    color: "text-orange-600",
    bg: "bg-orange-50",
    items: [
      {
        q: "How do I raise a repair request for my customer's product?",
        a: "Go to Support → My Customers, search for the customer by mobile or serial number, open their profile, and tap 'Raise Repair Ticket'. Provide the issue description, product serial number, and preferred visit time.",
      },
      {
        q: "What is the repair TAT (Turnaround Time) for JMD products?",
        a: "Standard repair TAT is 3–5 business days for hardware issues. Complex repairs may take up to 7–10 business days. You'll receive updates at each stage via app notifications and SMS.",
      },
      {
        q: "How do I escalate a repair that is taking too long?",
        a: "Open the ticket from My Tickets, tap 'Escalate', choose escalation reason (e.g., 'Beyond TAT'), and submit. Escalations are reviewed within 4 business hours and a senior engineer is assigned.",
      },
    ],
  },
  {
    category: "Delivery Issues",
    icon: Truck,
    color: "text-green-600",
    bg: "bg-green-50",
    items: [
      {
        q: "My order is delayed beyond the expected delivery date — what to do?",
        a: "First check the live tracking in My Orders. If the status shows no update for 24+ hours, raise a 'Delivery Delayed' ticket under Self Help → Raise Ticket. Our logistics team will investigate and update within 24 hours.",
      },
      {
        q: "I received a damaged product — how do I raise a complaint?",
        a: "Raise a 'Damaged on Arrival' ticket immediately (within 48 hours of delivery) with photos of the damage. Go to Self Help → Raise Ticket → Delivery Issues → Damaged Product. Attach clear photos for faster resolution.",
      },
      {
        q: "How do I report a partial or incorrect delivery?",
        a: "Go to the specific order in My Orders, tap the affected item, and select 'Report Issue' → 'Wrong / Missing Item'. Describe the discrepancy and attach an unboxing photo if available. Replacement or credit will be processed within 3–5 business days.",
      },
    ],
  },
  {
    category: "Billing & Invoices",
    icon: FileText,
    color: "text-amber-600",
    bg: "bg-amber-50",
    items: [
      {
        q: "How do I download my invoice / bill copy?",
        a: "Go to My Orders → tap the order → tap 'Download Invoice'. The invoice will be available as a PDF. For GST invoices and credit notes, they are also sent to your registered email within 24 hours of delivery.",
      },
      {
        q: "There is a pricing discrepancy in my invoice — how to resolve?",
        a: "Raise a 'Billing Dispute' ticket under Self Help → Billing & Invoices. Attach the invoice copy and describe the discrepancy. Our finance team will verify and issue a corrected invoice or credit note within 5–7 business days.",
      },
      {
        q: "How do I get a GST-compliant invoice for my B2B purchases?",
        a: "All B2B orders automatically generate GST-compliant invoices. Ensure your GSTIN is correctly registered in My Business → Business Profile. If GSTIN is missing on an existing invoice, raise a 'GST Invoice Correction' ticket.",
      },
    ],
  },
  {
    category: "Refunds & Returns",
    icon: RotateCcw,
    color: "text-red-600",
    bg: "bg-red-50",
    items: [
      {
        q: "Refund not received after my return was approved — what to do?",
        a: "Refunds are processed within 5–7 business days after return pickup confirmation. If it has been more than 7 days since your return was confirmed, raise a 'Refund Delayed' ticket with the return order number for immediate escalation.",
      },
      {
        q: "How do I initiate a return for a product?",
        a: "Returns must be initiated within 7 days of delivery. Go to My Orders → tap the item → 'Raise Return Request'. Select the return reason, upload product photos, and confirm pickup address. Return pickup is scheduled within 48 hours.",
      },
      {
        q: "What is the refund timeline for returned products?",
        a: "After the return pickup is confirmed and quality check is completed (2–3 days), refund is processed within 3–5 business days to your original payment method or as store credit, whichever you choose.",
      },
    ],
  },
  {
    category: "Other Issues",
    icon: HelpCircle,
    color: "text-gray-500",
    bg: "bg-gray-50",
    items: [
      {
        q: "How do I track a service order (SO) status?",
        a: "Use the SO Lookup tab in the bottom navigation. Enter the SO number (format: SOXXXXXXXX) or the customer's registered mobile number. You'll see the full status timeline including engineer visit history and closure details.",
      },
      {
        q: "How do I contact JMD support directly?",
        a: "You can reach us via Live Chat (available 9 AM – 9 PM) in the Support tab, or call our B2B helpline at 1800-XXX-XXXX (toll-free, Mon–Sat, 9 AM–6 PM). For urgent escalations, use the Priority Support option in Live Chat.",
      },
    ],
  },
];

type FeedbackState = Record<string, "up" | "down" | null>;

export default function FaqPage() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>({});
  const [showTicketBanner, setShowTicketBanner] = useState<string | null>(null);

  const filteredData = FAQ_DATA.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  const handleFeedback = (key: string, val: "up" | "down") => {
    setFeedback((prev) => ({ ...prev, [key]: val }));
    if (val === "down") setShowTicketBanner(key);
    else setShowTicketBanner(null);
  };

  return (
    <div className="animate-fade-in pb-4 -mx-4 -mt-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-blue-700 px-4 pt-5 pb-6 text-white">
        <h1 className="text-lg font-bold mb-0.5">Knowledge Base</h1>
        <p className="text-xs text-white/75 mb-4">Browse articles &amp; guides</p>
        {/* Search */}
        <div className="flex items-center gap-2 bg-white/15 border border-white/25 rounded-xl px-4 py-2.5">
          <Search className="w-4 h-4 text-white/70 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="bg-transparent flex-1 text-sm text-white placeholder:text-white/60 outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X className="w-4 h-4 text-white/70" />
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      {search && (
        <div className="px-4 py-2">
          <p className="text-xs text-muted-foreground">
            {filteredData.reduce((acc, c) => acc + c.items.length, 0)} result(s) for "{search}"
          </p>
        </div>
      )}

      {/* FAQ Sections */}
      <div className="px-4 pt-3 space-y-3 pb-4">
        {filteredData.length === 0 ? (
          <div className="text-center py-12">
            <HelpCircle className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm font-semibold text-foreground">No results found</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">Try different keywords or raise a support ticket</p>
            <Link
              to="/service/self/create"
              className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full"
            >
              <TicketCheck className="w-4 h-4" />
              Raise a Ticket
            </Link>
          </div>
        ) : (
          filteredData.map((cat) => (
            <div key={cat.category} className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
              {/* Category Header */}
              <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border">
                <div className={`w-7 h-7 rounded-lg ${cat.bg} flex items-center justify-center flex-shrink-0`}>
                  <cat.icon className={`w-3.5 h-3.5 ${cat.color}`} />
                </div>
                <span className="text-sm font-bold text-foreground">{cat.category}</span>
                <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {cat.items.length} Articles
                </span>
              </div>

              {/* Items */}
              {cat.items.map((item, idx) => {
                const key = `${cat.category}-${idx}`;
                const isOpen = expanded === key;
                const fb = feedback[key];

                return (
                  <div key={key} className="border-b border-border last:border-b-0">
                    {/* Question */}
                    <button
                      onClick={() => setExpanded(isOpen ? null : key)}
                      className="w-full flex items-start justify-between gap-3 px-4 py-3.5 text-left active:bg-accent/10 transition-colors"
                    >
                      <span className="text-[13px] font-medium text-foreground leading-snug flex-1">{item.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      )}
                    </button>

                    {/* Answer */}
                    {isOpen && (
                      <div className="px-4 pb-4">
                        <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">{item.a}</p>

                        {/* Feedback */}
                        {fb === null || fb === undefined ? (
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] text-muted-foreground">Was this helpful?</span>
                            <button
                              onClick={() => handleFeedback(key, "up")}
                              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-success transition-colors"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" /> Yes
                            </button>
                            <button
                              onClick={() => handleFeedback(key, "down")}
                              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <ThumbsDown className="w-3.5 h-3.5" /> No
                            </button>
                          </div>
                        ) : fb === "up" ? (
                          <p className="text-[11px] text-success flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" /> Thanks for your feedback!
                          </p>
                        ) : (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <p className="text-[12px] font-semibold text-amber-800 mb-1">Still not resolved?</p>
                            <p className="text-[11px] text-amber-700 mb-2.5">
                              Raise a support ticket and our team will help you.
                            </p>
                            <Link
                              to="/service/self/create"
                              className="inline-flex items-center gap-1.5 bg-primary text-white text-[11px] font-bold px-3 py-1.5 rounded-full"
                            >
                              <TicketCheck className="w-3 h-3" />
                              Raise a Support Ticket
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Bottom CTA */}
      <div className="mx-4 bg-gradient-to-r from-primary to-blue-600 rounded-xl p-4">
        <p className="text-white font-bold text-sm mb-0.5">Didn't find your answer?</p>
        <p className="text-white/70 text-xs mb-3">Our support team is here to help</p>
        <div className="flex gap-2">
          <Link
            to="/service/self/create"
            className="flex-1 flex items-center justify-center gap-1.5 bg-white text-primary text-xs font-bold px-3 py-2 rounded-full"
          >
            <TicketCheck className="w-3.5 h-3.5" />
            Raise Ticket
          </Link>
          <Link
            to="/chat"
            className="flex-1 flex items-center justify-center gap-1.5 bg-white/20 text-white text-xs font-bold px-3 py-2 rounded-full border border-white/30"
          >
            Live Call
          </Link>
        </div>
      </div>
    </div>
  );
}
