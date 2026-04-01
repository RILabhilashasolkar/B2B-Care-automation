import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  Headphones,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Bell,
  Search,
  Home,
  Briefcase,
  LayoutGrid,
  Tag,
  Package,
  Star,
  Info,
  Shield,
  Wrench,
} from "lucide-react";

const sidebarSections = [
  {
    heading: "JioMart Digital",
    items: [
      { label: "Brands", icon: Tag, path: "/category" },
      { label: "Bulk Order", icon: Package, path: "/orders" },
      { label: "Maxx Coins Zone", icon: Star, path: "/" },
      { label: "Support", icon: Headphones, path: "/help" },
      { label: "Notifications", icon: Bell, path: "/" },
      { label: "Create Installation Request", icon: Wrench, path: "/orders" },
    ],
  },
  {
    heading: "Account",
    items: [
      { label: "Business Details", icon: Briefcase, path: "/my-business" },
      { label: "About Us", icon: Info, path: "/" },
      { label: "Privacy Policy", icon: Shield, path: "/" },
    ],
  },
];

const bottomTabs = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Category", icon: LayoutGrid, path: "/category" },
  { label: "Orders", icon: ShoppingBag, path: "/orders" },
  { label: "My Business", icon: Briefcase, path: "/my-business" },
  { label: "Help & Support", icon: Headphones, path: "/help" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isTabActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    if (path === "/category") return location.pathname === "/category";
    if (path === "/orders") return location.pathname.startsWith("/orders");
    if (path === "/my-business") return location.pathname === "/my-business";
    if (path === "/help") return (
      location.pathname === "/help" ||
      location.pathname === "/help/desk" ||
      location.pathname === "/faq" ||
      location.pathname === "/chat" ||
      location.pathname.startsWith("/service") ||
      location.pathname.startsWith("/ticket")
    );
    return false;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Top Bar - App Style */}
      <header className="bg-primary text-primary-foreground flex items-center justify-between px-3 py-2.5 flex-shrink-0">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg active:bg-sidebar-accent transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 mx-2">
          <div className="flex items-center gap-2 bg-primary-foreground/15 rounded-full px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-primary-foreground/70" />
            <span className="text-xs text-primary-foreground/70">Search Products</span>
          </div>
        </div>

        <button className="relative p-2 rounded-lg active:bg-sidebar-accent transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-accent text-[9px] font-bold rounded-full flex items-center justify-center text-white">
            3
          </span>
        </button>
      </header>

      {/* Slide-out Sidebar Overlay */}
      {sidebarOpen && (
        <div className="absolute inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-foreground/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-72 bg-primary text-primary-foreground flex flex-col h-full shadow-2xl animate-slide-in-left">
            {/* Sidebar Header */}
            <div className="h-16 flex items-center justify-between px-5 border-b border-sidebar-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-foreground flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">R</span>
                </div>
                <div>
                  <h1 className="font-bold text-sm">Reliance</h1>
                  <p className="text-[10px] text-sidebar-muted">B2B Retailer Portal</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-sidebar-accent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 px-3 space-y-4 overflow-y-auto phone-scroll">
              {sidebarSections.map((section) => (
                <div key={section.heading}>
                  <p className="text-[10px] font-bold text-sidebar-muted uppercase tracking-wider px-3 mb-1.5">{section.heading}</p>
                  <div className="space-y-0.5">
                    {section.items.map((item) => (
                      <Link
                        key={item.label}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors border-b border-sidebar-border/30 last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 text-primary flex-shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-sidebar-muted" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            {/* User */}
            <div className="p-3 border-t border-sidebar-border">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-9 h-9 rounded-full bg-sidebar-accent flex items-center justify-center">
                  <span className="text-xs font-semibold">AK</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Arun Kumar</p>
                  <p className="text-[10px] text-sidebar-muted">Retailer ID: RET-4521</p>
                </div>
                <button className="text-sidebar-muted hover:text-primary-foreground">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Page Content */}
      <main className="flex-1 overflow-y-auto min-h-0 phone-scroll relative">
        <div className="p-4">
          {children}
        </div>
      </main>

      {/* Bottom Tab Bar */}
      <nav className="bg-card border-t border-border flex items-center justify-around py-2 flex-shrink-0">
        {bottomTabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors min-w-[60px] ${
              isTabActive(tab.path)
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <tab.icon className={`w-5 h-5 ${isTabActive(tab.path) ? "stroke-[2.5]" : ""}`} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
