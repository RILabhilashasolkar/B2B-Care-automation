import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  Headphones,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  User,
  Users,
  LogOut,
  Bell,
  Search,
  Home,
  Briefcase,
  LifeBuoy,
} from "lucide-react";

const navItems = [
  {
    label: "Self Help & Service",
    icon: Headphones,
    path: "",
    children: [
      { label: "Self", icon: User, path: "/service/self" },
      { label: "My Customer", icon: Users, path: "/service/customer" },
    ],
  },
];

const bottomTabs = [
  { label: "Orders", icon: ShoppingBag, path: "/orders" },
  { label: "Support", icon: LifeBuoy, path: "/help" },
  { label: "Help Desk", icon: Home, path: "/" },
  { label: "Customers", icon: Users, path: "/service/customer" },
  { label: "My Business", icon: Briefcase, path: "/my-business" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [serviceExpanded, setServiceExpanded] = useState(true);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isServiceActive = location.pathname.startsWith("/service");

  const isTabActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    if (path === "/help") return location.pathname === "/help" || location.pathname === "/faq" || location.pathname === "/chat";
    return location.pathname.startsWith(path);
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
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
              {navItems.map((item) =>
                item.children ? (
                  <div key={item.label}>
                    <button
                      onClick={() => setServiceExpanded(!serviceExpanded)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isServiceActive
                          ? "bg-sidebar-accent text-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent"
                      }`}
                    >
                      <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {serviceExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    {serviceExpanded && (
                      <div className="ml-4 mt-1 space-y-0.5">
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive(child.path)
                                ? "bg-primary-foreground text-primary"
                                : "text-sidebar-muted hover:bg-sidebar-accent hover:text-primary-foreground"
                            }`}
                          >
                            <child.icon className="w-4 h-4" />
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? "bg-primary-foreground text-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    <item.icon className="w-[18px] h-[18px]" />
                    {item.label}
                  </Link>
                )
              )}
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
