import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ticketCategories } from "../lib/mockData";
import { ArrowLeft, Upload, ChevronRight } from "lucide-react";

interface Props {
  type: "self" | "customer";
}

export default function CreateTicketPage({ type }: Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preCategory = searchParams.get("type");

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    category: "",
    subcategory: "",
    subSubcategory: "",
    description: "",
    orderId: searchParams.get("orderId") || "",
    customerName: "",
    customerMobile: "",
    attachments: [] as string[],
  });

  const categories = type === "self" ? ticketCategories.self : ticketCategories.customer;
  const selectedCat = categories.find((c) => c.category === form.category);
  const selectedSub = selectedCat?.subcategories.find((s) => s.name === form.subcategory);

  // suppress unused variable warning for preCategory
  void preCategory;

  const handleSubmit = () => {
    const ticketId = `TKT-${type === "self" ? "S" : "C"}-${String(Date.now()).slice(-4)}`;
    alert(`Ticket created successfully!\n\nTicket ID: ${ticketId}\nCategory: ${form.category}\nSubcategory: ${form.subcategory}`);
    navigate(type === "self" ? "/service/self" : "/service/customer");
  };

  return (
    <div className="space-y-3 animate-fade-in max-w-2xl">
      <div className="flex items-center gap-3">
        <Link to={type === "self" ? "/service/self" : "/service/customer"} className="p-2 rounded-lg hover:bg-accent transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-base font-bold text-foreground">
            {type === "self" ? "Raise Self Complaint" : "Raise Customer Ticket"}
          </h1>
          <p className="text-sm text-muted-foreground">Step {step} of 4</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? "bg-primary" : "bg-border"}`} />
        ))}
      </div>

      {/* Step 1: Order Details */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-foreground">Order Details</h2>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Order ID *</label>
            <input
              value={form.orderId}
              onChange={(e) => setForm({ ...form, orderId: e.target.value })}
              className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="e.g. ORD-2024-001847"
            />
          </div>
          {type === "customer" && (
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Customer Mobile Number *</label>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-card border border-border rounded-xl">
                <span className="text-xs text-muted-foreground font-medium">+91</span>
                <input
                  value={form.customerMobile}
                  onChange={(e) => setForm({ ...form, customerMobile: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                  className="flex-1 text-xs bg-transparent focus:outline-none"
                  placeholder="10-digit mobile number"
                />
              </div>
              {/* Mock existing customer lookup */}
              {form.customerMobile.length === 10 && (
                <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-green-800">Customer Found</p>
                  <p className="text-xs text-green-700 mt-0.5">Rajesh Kumar · Mumbai · 2 previous tickets</p>
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => form.orderId ? setStep(2) : null}
            disabled={!form.orderId}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-semibold disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Category Selection */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-foreground">Select Category</h2>
          <div className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat.category}
                onClick={() => { setForm({ ...form, category: cat.category, subcategory: "", subSubcategory: "" }); }}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                  form.category === cat.category
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <span className="text-sm font-medium text-foreground">{cat.category}</span>
              </button>
            ))}
          </div>

          {form.category && selectedCat && (
            <>
              <h3 className="text-base font-semibold text-foreground mt-4">Select Subcategory</h3>
              <div className="space-y-2">
                {selectedCat.subcategories.map((sub) => (
                  <button
                    key={sub.name}
                    onClick={() => { setForm({ ...form, subcategory: sub.name, subSubcategory: "" }); }}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                      form.subcategory === sub.name
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <span className="text-sm font-medium text-foreground">{sub.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {form.subcategory && selectedSub && (
            <>
              <h3 className="text-base font-semibold text-foreground mt-4">Specify Issue</h3>
              <div className="flex flex-wrap gap-2">
                {selectedSub.subSub.map((ss) => (
                  <button
                    key={ss}
                    onClick={() => setForm({ ...form, subSubcategory: ss })}
                    className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                      form.subSubcategory === ss
                        ? "border-primary bg-primary/5 text-primary font-medium"
                        : "border-border bg-card text-foreground hover:border-primary/30"
                    }`}
                  >
                    {ss}
                  </button>
                ))}
              </div>
            </>
          )}

          {form.subSubcategory && (
            <button
              onClick={() => setStep(3)}
              className="mt-4 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Continue <ChevronRight className="inline w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Step 3: Details */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-foreground">Provide Details</h2>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Issue Description *</label>
            <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" rows={4} placeholder="Describe the issue in detail..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Attachments</label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/30 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Drop files here or click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">Photos, invoices, screenshots (max 5MB each)</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setStep(4)} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              Review & Submit
            </button>
            <button onClick={() => setStep(2)} className="px-6 py-2.5 bg-card border border-border text-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors">
              Back
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-foreground">Review & Confirm</h2>
          <div className="bg-card rounded-xl border border-border p-5 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {form.orderId && <div><span className="text-muted-foreground">Order ID:</span> <span className="font-medium text-foreground">{form.orderId}</span></div>}
              {form.customerMobile && <div><span className="text-muted-foreground">Mobile:</span> <span className="font-medium text-foreground">{form.customerMobile}</span></div>}
              <div><span className="text-muted-foreground">Category:</span> <span className="font-medium text-foreground">{form.category}</span></div>
              <div><span className="text-muted-foreground">Subcategory:</span> <span className="font-medium text-foreground">{form.subcategory}</span></div>
              <div><span className="text-muted-foreground">Issue Type:</span> <span className="font-medium text-foreground">{form.subSubcategory}</span></div>
            </div>
            {form.description && (
              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">Description:</p>
                <p className="text-sm text-foreground">{form.description}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleSubmit} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              Submit Ticket
            </button>
            <button onClick={() => setStep(3)} className="px-6 py-2.5 bg-card border border-border text-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors">
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
