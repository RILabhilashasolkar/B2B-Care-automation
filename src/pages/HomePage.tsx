import { Link } from "react-router-dom";
import {
  MapPin, Smartphone, Tv, Headphones, Zap, WashingMachine,
  ChevronRight, Tag, Package, LifeBuoy, ShoppingBag
} from "lucide-react";

const CATEGORY_CHIPS = [
  { label: "Latest Deals", icon: Tag, bg: "bg-red-50", color: "text-red-600" },
  { label: "Smartphones", icon: Smartphone, bg: "bg-blue-50", color: "text-blue-600" },
  { label: "Television", icon: Tv, bg: "bg-violet-50", color: "text-violet-600" },
  { label: "Audio", icon: Headphones, bg: "bg-amber-50", color: "text-amber-600" },
  { label: "Appliances", icon: WashingMachine, bg: "bg-green-50", color: "text-green-600" },
  { label: "Adapters", icon: Zap, bg: "bg-orange-50", color: "text-orange-600" },
];

export default function HomePage() {
  return (
    <div className="animate-fade-in -mx-4 -mt-4">
      {/* Location bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-card border-b border-border">
        <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
        <span className="text-xs text-foreground">
          Deliver to <strong>Mumbai 400050</strong>
        </span>
        <button className="ml-auto text-xs text-primary font-bold">Change</button>
      </div>

      {/* Category chips */}
      <div className="px-4 py-3 overflow-x-auto phone-scroll">
        <div className="flex gap-3 w-max">
          {CATEGORY_CHIPS.map((cat) => (
            <Link
              key={cat.label}
              to="/category"
              className="flex flex-col items-center gap-1.5 active:opacity-70"
            >
              <div className={`w-14 h-14 rounded-full ${cat.bg} flex items-center justify-center border border-border`}>
                <cat.icon className={`w-6 h-6 ${cat.color}`} />
              </div>
              <span className="text-[10px] font-medium text-foreground text-center w-14 leading-tight">{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured banners */}
      <div className="px-4 space-y-3 pb-4">
        {/* Clearance Sale banner */}
        <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-indigo-100 rounded-2xl overflow-hidden border border-blue-200">
          <div className="flex items-center justify-between p-4">
            <div className="flex-1">
              <div className="bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded mb-2 w-fit tracking-wide">realme</div>
              <h2 className="text-base font-black text-gray-900 leading-tight">Clearance Sale!</h2>
              <p className="text-sm text-gray-600 mt-0.5">Up to <span className="font-bold text-primary text-base">50% Off</span></p>
              <button className="mt-3 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full">Buy Now</button>
            </div>
            <div className="w-28 h-24 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-xl flex items-center justify-center ml-3 flex-shrink-0">
              <Smartphone className="w-14 h-14 text-indigo-700" />
            </div>
          </div>
          {/* dots */}
          <div className="flex justify-center gap-1.5 pb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30"></span>
            <span className="w-4 h-1.5 rounded-full bg-primary"></span>
          </div>
        </div>

        {/* Samsung Adapter banner */}
        <div className="bg-amber-400 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs font-bold text-gray-800 tracking-wider">SAMSUNG 25W</p>
              <p className="text-xl font-black text-gray-900 leading-tight">ADAPTER</p>
              <p className="text-xs text-gray-700 mt-1">
                for as low as <span className="font-black">₹949*</span>
              </p>
              <p className="text-[9px] text-gray-600 mt-1 max-w-[140px] leading-tight">
                *Deal Price Applicable on Purchase of 6 Units.
              </p>
            </div>
            <div className="w-20 h-24 bg-amber-300 rounded-xl flex items-center justify-center ml-2 flex-shrink-0 border border-amber-500/30">
              <Zap className="w-10 h-10 text-amber-800" />
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="pt-2">
          <h2 className="text-sm font-bold text-foreground mb-2.5">Quick Access</h2>
          <div className="grid grid-cols-2 gap-2.5">
            <Link
              to="/orders"
              className="bg-card rounded-xl border border-border p-3 flex items-center gap-3 active:bg-accent/10"
            >
              <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">My Orders</p>
                <p className="text-[10px] text-muted-foreground">View B2B orders</p>
              </div>
            </Link>
            <Link
              to="/help"
              className="bg-card rounded-xl border border-border p-3 flex items-center gap-3 active:bg-accent/10"
            >
              <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <LifeBuoy className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Help & Support</p>
                <p className="text-[10px] text-muted-foreground">Care & tickets</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
