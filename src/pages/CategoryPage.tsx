import { Smartphone, Tv, Headphones, Zap, WashingMachine, Laptop, Camera, Gamepad2, Watch, Speaker, Fan, Refrigerator } from "lucide-react";

const CATEGORIES = [
  { label: "Smartphones", icon: Smartphone, bg: "bg-blue-50", color: "text-blue-600" },
  { label: "Televisions", icon: Tv, bg: "bg-violet-50", color: "text-violet-600" },
  { label: "Audio", icon: Headphones, bg: "bg-amber-50", color: "text-amber-600" },
  { label: "Adapters & Chargers", icon: Zap, bg: "bg-orange-50", color: "text-orange-600" },
  { label: "Washing Machines", icon: WashingMachine, bg: "bg-green-50", color: "text-green-600" },
  { label: "Laptops", icon: Laptop, bg: "bg-sky-50", color: "text-sky-600" },
  { label: "Cameras", icon: Camera, bg: "bg-pink-50", color: "text-pink-600" },
  { label: "Gaming", icon: Gamepad2, bg: "bg-red-50", color: "text-red-600" },
  { label: "Wearables", icon: Watch, bg: "bg-teal-50", color: "text-teal-600" },
  { label: "Speakers", icon: Speaker, bg: "bg-indigo-50", color: "text-indigo-600" },
  { label: "Fans & ACs", icon: Fan, bg: "bg-cyan-50", color: "text-cyan-600" },
  { label: "Refrigerators", icon: Refrigerator, bg: "bg-emerald-50", color: "text-emerald-600" },
];

export default function CategoryPage() {
  return (
    <div className="space-y-3 animate-fade-in">
      <div>
        <h1 className="text-base font-bold text-foreground">Shop by Category</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Browse all product categories</p>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.label}
            className="bg-card rounded-xl border border-border p-3 flex flex-col items-center gap-2 active:bg-accent/10 transition-colors"
          >
            <div className={`w-12 h-12 rounded-xl ${cat.bg} flex items-center justify-center`}>
              <cat.icon className={`w-6 h-6 ${cat.color}`} />
            </div>
            <span className="text-[10px] font-semibold text-foreground text-center leading-tight">{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
