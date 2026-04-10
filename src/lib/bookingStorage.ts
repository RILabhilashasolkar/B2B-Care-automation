// ── Shared localStorage bridge between CustomerInstallBookingPage and B2B app ──
// In production this would be a backend API call. For the prototype we use
// localStorage so both the customer tab and the retailer tab (same device/demo)
// reflect each other in real time.

export interface CustomerBooking {
  ref: string;
  serialNumber: string;
  productName: string;
  customerName: string;
  customerMobile: string;
  address: string;
  city: string;
  pincode: string;
  preferredDate: string;
  submittedAt: string;
  status: "Pending" | "Confirmed" | "Completed";
}

const STORAGE_KEY = "jmd_customer_bookings";

export function getBookings(): CustomerBooking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CustomerBooking[]) : [];
  } catch {
    return [];
  }
}

export function saveBooking(booking: CustomerBooking): void {
  const all = getBookings();
  const idx = all.findIndex((b) => b.serialNumber === booking.serialNumber);
  if (idx >= 0) all[idx] = booking;
  else all.unshift(booking);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(all)); } catch { /* quota */ }
}

export function updateBookingStatus(
  ref: string,
  status: CustomerBooking["status"]
): void {
  const all = getBookings();
  const idx = all.findIndex((b) => b.ref === ref);
  if (idx >= 0) {
    all[idx].status = status;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(all)); } catch { /* quota */ }
  }
}

export function getBookingBySerial(sn: string): CustomerBooking | null {
  return getBookings().find((b) => b.serialNumber === sn) ?? null;
}

export function getBookingByMobile(mobile: string): CustomerBooking[] {
  return getBookings().filter((b) => b.customerMobile === mobile);
}
