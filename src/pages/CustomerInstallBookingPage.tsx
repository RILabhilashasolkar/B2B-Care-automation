import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Package, MapPin, Calendar, CheckCircle,
  Smartphone, User, ChevronRight,
} from "lucide-react";

// ── Input helper ──────────────────────────────────────────────────────────
const fieldCls = (err?: boolean) =>
  `w-full px-4 py-3 bg-white border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3B4FE8]/30 placeholder:text-gray-400 transition-all ${
    err ? "border-red-400 focus:ring-red-300" : "border-gray-200"
  }`;

type BookingForm = {
  name: string;
  mobile: string;
  address: string;
  city: string;
  pincode: string;
  preferredDate: string;
};

export default function CustomerInstallBookingPage() {
  const [params] = useSearchParams();

  const productName  = params.get("p")  || "Your Product";
  const serialNumber = params.get("s")  || "";
  const retailer     = params.get("r")  || "Your JioMart Retailer";
  const preMobile    = params.get("m")  || "";

  const [form, setForm] = useState<BookingForm>({
    name: "", mobile: preMobile, address: "", city: "", pincode: "", preferredDate: "",
  });
  const [errors, setErrors]   = useState<Partial<BookingForm>>({});
  const [submitted, setSubmitted] = useState(false);
  const [bookingRef] = useState(() => `INST-${Date.now().toString().slice(-6)}`);

  const sf = (field: keyof BookingForm, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const handleSubmit = () => {
    const errs: Partial<BookingForm> = {};
    if (!form.name.trim())                         errs.name    = "Please enter your full name";
    if (!/^[6-9]\d{9}$/.test(form.mobile))        errs.mobile  = "Enter valid 10-digit mobile";
    if (!form.address.trim())                      errs.address = "Please enter your address";
    if (!form.city.trim())                         errs.city    = "Please enter your city";
    if (!/^\d{6}$/.test(form.pincode))            errs.pincode = "Enter valid 6-digit pincode";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitted(true);
  };

  // ── Success screen ──────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8F5E9] to-[#F0F4FF] flex flex-col items-center justify-center px-6 py-10 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center mb-6 shadow-lg shadow-emerald-200">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Request Confirmed!</h1>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed max-w-xs">
          Your installation request has been received. Our team will contact you shortly to confirm the date.
        </p>

        <div className="bg-white rounded-3xl shadow-md px-6 py-5 w-full max-w-sm text-left mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Booking Summary</p>
          <div className="space-y-2.5 text-sm text-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Ref #</span>
              <span className="font-bold font-mono text-[#3B4FE8]">{bookingRef}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Product</span>
              <span className="font-semibold text-right max-w-[180px] text-xs">{productName}</span>
            </div>
            {serialNumber && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Serial No.</span>
                <span className="font-mono text-xs">{serialNumber}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Name</span>
              <span className="font-semibold">{form.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Mobile</span>
              <span>+91 {form.mobile}</span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-gray-400 flex-shrink-0">Address</span>
              <span className="text-right text-xs">{form.address}, {form.city} — {form.pincode}</span>
            </div>
            {form.preferredDate && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Preferred Date</span>
                <span>{new Date(form.preferredDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-400">
          Sold by <span className="font-semibold text-gray-600">{retailer}</span>
        </p>
        <p className="text-[11px] text-gray-300 mt-1">Powered by JioMart Digital</p>
      </div>
    );
  }

  // ── Booking form ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F5F7FF]">

      {/* Hero header */}
      <div className="bg-gradient-to-br from-[#3B4FE8] to-[#6366F1] px-5 pt-8 pb-10 text-white">
        <div className="flex items-center gap-1.5 mb-3">
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-[9px] font-black text-white">JM</span>
          </div>
          <span className="text-[11px] font-semibold text-white/80">JioMart Digital</span>
        </div>
        <h1 className="text-xl font-black mb-1">Book Free Installation</h1>
        <p className="text-sm text-white/75 leading-snug">
          Just a few details and we'll schedule your installation at your convenience
        </p>
      </div>

      {/* Product card — overlapping hero */}
      <div className="px-4 -mt-5">
        <div className="bg-white rounded-2xl shadow-md px-4 py-3.5 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#3B4FE8]/10 flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 text-[#3B4FE8]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 leading-snug">{productName}</p>
            {serialNumber && (
              <p className="text-[11px] font-mono text-gray-400 mt-0.5">SN: {serialNumber}</p>
            )}
          </div>
          <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 flex-shrink-0">
            FREE
          </span>
        </div>
      </div>

      {/* Progress steps */}
      <div className="px-5 mt-5 mb-1 flex items-center gap-2">
        {["Your Details", "Address", "Schedule"].map((step, i) => (
          <div key={step} className="flex items-center gap-2 flex-1">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 ${
              i === 0 ? "bg-[#3B4FE8] text-white" : "bg-gray-200 text-gray-400"
            }`}>
              {i + 1}
            </div>
            <span className={`text-[10px] font-semibold ${i === 0 ? "text-[#3B4FE8]" : "text-gray-300"}`}>
              {step}
            </span>
            {i < 2 && <ChevronRight className="w-3 h-3 text-gray-300 flex-shrink-0" />}
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="px-4 py-4 space-y-4 pb-8">

        {/* Your Details */}
        <div className="bg-white rounded-3xl shadow-sm px-4 py-4 space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Details</p>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2">
              <User className="w-3.5 h-3.5" /> Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={(e) => sf("name", e.target.value)}
              className={fieldCls(!!errors.name)}
            />
            {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Number <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-3 rounded-2xl">+91</span>
              <input
                type="tel"
                placeholder="10-digit mobile"
                value={form.mobile}
                maxLength={10}
                onChange={(e) => sf("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
                className={`${fieldCls(!!errors.mobile)} flex-1`}
              />
            </div>
            {errors.mobile && <p className="text-[11px] text-red-500 mt-1">{errors.mobile}</p>}
          </div>
        </div>

        {/* Installation Address */}
        <div className="bg-white rounded-3xl shadow-sm px-4 py-4 space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> Installation Address
          </p>

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-2 block">
              Street / Flat / Building <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="House no., street, area"
              value={form.address}
              onChange={(e) => sf("address", e.target.value)}
              className={fieldCls(!!errors.address)}
            />
            {errors.address && <p className="text-[11px] text-red-500 mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-2 block">
                City <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="City"
                value={form.city}
                onChange={(e) => sf("city", e.target.value)}
                className={fieldCls(!!errors.city)}
              />
              {errors.city && <p className="text-[11px] text-red-500 mt-1">{errors.city}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-2 block">
                Pincode <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="6-digit"
                value={form.pincode}
                maxLength={6}
                onChange={(e) => sf("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                className={fieldCls(!!errors.pincode)}
              />
              {errors.pincode && <p className="text-[11px] text-red-500 mt-1">{errors.pincode}</p>}
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-3xl shadow-sm px-4 py-4 space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Preferred Schedule
          </p>
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-2 block">
              Preferred Date <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="date"
              value={form.preferredDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => sf("preferredDate", e.target.value)}
              className={fieldCls()}
            />
          </div>
        </div>

        {/* Retailer tag */}
        <div className="flex items-center justify-center gap-1.5">
          <span className="text-[11px] text-gray-400">Sold by</span>
          <span className="text-[11px] font-semibold text-gray-600">{retailer}</span>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-[#3B4FE8] text-white rounded-2xl text-sm font-black shadow-lg shadow-[#3B4FE8]/30 hover:bg-[#2d3fd4] active:scale-[0.98] transition-all"
        >
          Confirm Installation Request 🚀
        </button>

        <p className="text-center text-[11px] text-gray-400 pb-4">
          Powered by <span className="font-semibold text-gray-500">JioMart Digital</span>
        </p>
      </div>
    </div>
  );
}
