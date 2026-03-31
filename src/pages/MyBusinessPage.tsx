import {
  Store, MapPin, Phone, Mail, FileText, ChevronRight,
  TrendingUp, ShoppingBag, Users, Star, Bell, Shield, LogOut,
  Edit
} from "lucide-react";

const STATS = [
  { label: "Monthly Orders", value: "₹4.2L", sub: "+12% vs last month", color: "text-primary", bg: "bg-primary/10" },
  { label: "Active Customers", value: "38", sub: "2 new this week", color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Open Tickets", value: "5", sub: "2 need attention", color: "text-amber-600", bg: "bg-amber-50" },
  { label: "JMD Score", value: "4.7★", sub: "Top 10% retailer", color: "text-violet-600", bg: "bg-violet-50" },
];

const MENU_ITEMS = [
  {
    section: "Account",
    items: [
      { label: "Business Profile", icon: Store, sub: "Update GST, trade name, address" },
      { label: "Bank & Payments", icon: FileText, sub: "Linked bank account, UPI" },
      { label: "Notifications", icon: Bell, sub: "Manage alerts & preferences" },
    ],
  },
  {
    section: "Business",
    items: [
      { label: "Sales Performance", icon: TrendingUp, sub: "Monthly reports & insights" },
      { label: "My Orders History", icon: ShoppingBag, sub: "All past & active orders" },
      { label: "Customer Feedback", icon: Star, sub: "Ratings from your customers" },
      { label: "My Team", icon: Users, sub: "Add / manage sub-users" },
    ],
  },
  {
    section: "Support & Legal",
    items: [
      { label: "Privacy & Security", icon: Shield, sub: "Password, 2FA, data settings" },
      { label: "Terms & Policies", icon: FileText, sub: "JMD B2B terms of service" },
    ],
  },
];

export default function MyBusinessPage() {
  return (
    <div className="animate-fade-in pb-4 -mx-4 -mt-4">
      {/* Profile Banner */}
      <div className="bg-gradient-to-br from-primary to-blue-700 px-4 pt-5 pb-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold">AK</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold">Arun Kumar</h1>
              <span className="bg-accent text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Gold</span>
            </div>
            <p className="text-xs text-white/75">Retailer ID: RET-4521</p>
            <p className="text-xs text-white/60">Mumbai, Maharashtra</p>
          </div>
          <button className="p-2 bg-white/15 rounded-xl">
            <Edit className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Business Info */}
        <div className="bg-white/10 rounded-xl p-3 space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-white/80">
            <Store className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Kumar Electronics & Appliances</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/80">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Shop 14, Dharavi Market, Mumbai 400017</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/80">
            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/80">
            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
            <span>arun.kumar@kumaretech.in</span>
          </div>
        </div>
      </div>

      {/* GSTIN Badge */}
      <div className="mx-4 -mt-3 bg-white rounded-xl shadow-sm border border-border p-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">GSTIN</p>
          <p className="text-sm font-bold text-foreground font-mono">27AAAAA0000A1Z5</p>
        </div>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Verified ✓</span>
      </div>

      {/* Stats Grid */}
      <div className="px-4 pt-4 grid grid-cols-2 gap-2.5">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-3 shadow-sm border border-border">
            <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-2`}>
              <TrendingUp className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] font-medium text-foreground">{s.label}</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Menu Sections */}
      {MENU_ITEMS.map((section) => (
        <div key={section.section} className="px-4 pt-4">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">
            {section.section}
          </p>
          <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
            {section.items.map((item, i) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-4 py-3.5 active:bg-accent/10 transition-colors ${
                  i < section.items.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4.5 h-4.5 text-foreground/70 w-4 h-4" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{item.sub}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Logout */}
      <div className="px-4 pt-4">
        <button className="w-full flex items-center justify-center gap-2 bg-destructive/10 text-destructive text-sm font-bold py-3.5 rounded-xl active:bg-destructive/20 transition-colors">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* Version */}
      <p className="text-center text-[10px] text-muted-foreground/50 mt-4">JMD B2B Care v1.0.0 · Retailer Portal</p>
    </div>
  );
}
