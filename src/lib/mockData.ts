// Mock data for the entire application

export interface Order {
  id: string;
  date: string;
  status: "Delivered" | "In Transit" | "Processing" | "Cancelled";
  total: number;
  items: number;
  shipments: Shipment[];
}

export interface Shipment {
  id: string;
  status: "Delivered" | "In Transit" | "Out for Delivery";
  deliveryDate: string;
  items: OrderItem[];
}

export type ServiceOrderStatus = "Open" | "Engineer Visit Pending" | "Engineer On the Way" | "Closed";

export interface ServiceOrder {
  id: string;
  itemId: string;
  customerMobile: string;
  status: ServiceOrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  sku: string;
  serialNumber: string;
  quantity: number;
  price: number;
  image: string;
  category: string;
  brand: string;
  productFamily: string;
  installationEligible: boolean;
  installationRequested: boolean;
  installationNotByUs: boolean;
  customerMobile?: string;
  serviceOrder?: ServiceOrder;
}

export interface Ticket {
  id: string;
  type: "self" | "customer";
  category: string;
  subcategory: string;
  subSubcategory?: string;
  status: "Open" | "In Progress" | "Awaiting Info" | "Resolved" | "Closed" | "Reopened";
  priority: "High" | "Medium" | "Low";
  description: string;
  createdAt: string;
  updatedAt: string;
  orderId?: string;
  customerName?: string;
  customerMobile?: string;
  productName?: string;
  serialNumber?: string;
  assignedTo?: string;
  attachments?: string[];
  timeline?: TicketEvent[];
}

export interface TicketEvent {
  id: string;
  type: "created" | "updated" | "comment" | "status_change" | "assigned";
  description: string;
  timestamp: string;
  actor: string;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  address: string;
  city: string;
  pincode: string;
  purchases: CustomerPurchase[];
  tickets: Ticket[];
  createdAt: string;
}

export interface CustomerPurchase {
  id: string;
  orderId: string;
  productName: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyExpiry: string;
  warrantyStatus: "Active" | "Expired" | "Extended";
  installationDate?: string;
  installationStatus: "Pending" | "Completed" | "Not Required";
}

export const ticketCategories = {
  self: [
    {
      category: "Order Issues",
      subcategories: [
        { name: "Wrong Item Received", subSub: ["Exchange Required", "Refund Required"] },
        { name: "Missing Items", subSub: ["Partial Delivery", "Complete Missing"] },
        { name: "Damaged Product", subSub: ["Transit Damage", "Manufacturing Defect"] },
      ],
    },
    {
      category: "Billing & Payments",
      subcategories: [
        { name: "Invoice Discrepancy", subSub: ["Amount Mismatch", "GST Issue", "Duplicate Charge"] },
        { name: "Payment Not Reflected", subSub: ["Online Payment", "Bank Transfer"] },
        { name: "Refund Not Received", subSub: ["Partial Refund", "Full Refund"] },
      ],
    },
    {
      category: "Delivery Issues",
      subcategories: [
        { name: "Delayed Delivery", subSub: ["Beyond ETA", "No Update"] },
        { name: "Wrong Address Delivery", subSub: ["Address Correction", "Re-delivery"] },
        { name: "Delivery Not Attempted", subSub: ["Access Issue", "Courier Issue"] },
      ],
    },
    {
      category: "Returns & Refunds",
      subcategories: [
        { name: "Return Request", subSub: ["Quality Issue", "Wrong Product", "Changed Mind"] },
        { name: "Pickup Not Scheduled", subSub: ["Pending Pickup", "Reschedule"] },
      ],
    },
  ],
  customer: [
    {
      category: "Installation",
      subcategories: [
        { name: "New Installation", subSub: ["Standard", "Complex Setup"] },
        { name: "Re-installation", subSub: ["Relocation", "Replacement"] },
        { name: "Installation Issue", subSub: ["Incomplete", "Faulty Setup"] },
      ],
    },
    {
      category: "Repair & Service",
      subcategories: [
        { name: "Product Not Working", subSub: ["No Power", "Performance Issue", "Error Code"] },
        { name: "Part Replacement", subSub: ["Under Warranty", "Out of Warranty"] },
        { name: "Scheduled Maintenance", subSub: ["Annual Service", "Filter Change"] },
      ],
    },
    {
      category: "Complaint Against Service",
      subcategories: [
        { name: "Technician Behavior", subSub: ["Unprofessional", "No Show"] },
        { name: "Service Quality", subSub: ["Issue Not Resolved", "Recurring Problem"] },
        { name: "Charges Dispute", subSub: ["Overcharged", "Unauthorized Charges"] },
      ],
    },
    {
      category: "Returns",
      subcategories: [
        { name: "Product Return", subSub: ["Defective", "Not as Described"] },
        { name: "Exchange Request", subSub: ["Size/Model Change", "Upgrade"] },
      ],
    },
  ],
};

export const mockOrders: Order[] = [
  {
    id: "BB67BDC1E80E074386E2",
    date: "2024-12-15",
    status: "Delivered",
    total: 245000,
    items: 5,
    shipments: [
      {
        id: "SHP-001847-A",
        status: "Delivered",
        deliveryDate: "2024-12-18",
        items: [
          { id: "ITM-001", name: "Samsung 55\" Crystal 4K UHD TV", sku: "SAM-TV-55CU", serialNumber: "ag29jdba90", quantity: 2, price: 42999, image: "", category: "Electronics", brand: "Samsung", productFamily: "Television", installationEligible: true, installationRequested: false, installationNotByUs: false },
          { id: "ITM-002", name: "LG 1.5 Ton 5 Star Split AC", sku: "LG-AC-15T5S", serialNumber: "ay49jaba91", quantity: 1, price: 38999, image: "", category: "Home Appliances", brand: "LG", productFamily: "Air Conditioner", installationEligible: true, installationRequested: true, installationNotByUs: false, customerMobile: "9876543211", serviceOrder: { id: "SO-2024-0001", itemId: "ITM-002", customerMobile: "9876543211", status: "Engineer Visit Pending", createdAt: "2024-12-19T14:00:00", updatedAt: "2024-12-21T10:00:00" } },
        ],
      },
      {
        id: "SHP-001847-B",
        status: "Delivered",
        deliveryDate: "2024-12-20",
        items: [
          { id: "ITM-003", name: "Whirlpool 245L Frost Free Refrigerator", sku: "WP-REF-245FF", serialNumber: "ag29jhda92", quantity: 2, price: 24999, image: "", category: "Home Appliances", brand: "Whirlpool", productFamily: "Refrigerator", installationEligible: true, installationRequested: false, installationNotByUs: false },
        ],
      },
    ],
  },
  {
    id: "BB65D874790EF3D651A0",
    date: "2024-12-10",
    status: "In Transit",
    total: 189500,
    items: 3,
    shipments: [
      {
        id: "SHP-001823-A",
        status: "In Transit",
        deliveryDate: "2024-12-22",
        items: [
          { id: "ITM-004", name: "Bosch 7kg Front Load Washing Machine", sku: "BSH-WM-7FL", serialNumber: "SN-WM-33891", quantity: 1, price: 35999, image: "", category: "Home Appliances", brand: "Bosch", productFamily: "Washing Machine", installationEligible: true, installationRequested: false, installationNotByUs: false },
          { id: "ITM-005", name: "Sony 65\" Bravia XR OLED TV", sku: "SNY-TV-65XR", serialNumber: "SN-TV-99102", quantity: 1, price: 129999, image: "", category: "Electronics", brand: "Sony", productFamily: "Television", installationEligible: true, installationRequested: false, installationNotByUs: true, customerMobile: "9876543213" },
        ],
      },
    ],
  },
  {
    id: "BB661A2B220E87559DA6",
    date: "2024-12-05",
    status: "Delivered",
    total: 78000,
    items: 4,
    shipments: [
      {
        id: "SHP-001790-A",
        status: "Delivered",
        deliveryDate: "2024-12-08",
        items: [
          { id: "ITM-006", name: "Havells 1200mm Ceiling Fan", sku: "HVL-FAN-1200", serialNumber: "SN-FAN-12001", quantity: 4, price: 2499, image: "", category: "Electricals", brand: "Havells", productFamily: "Fan", installationEligible: true, installationRequested: false, installationNotByUs: false },
        ],
      },
    ],
  },
];

export const mockSelfTickets: Ticket[] = [
  {
    id: "TKT-S-001",
    type: "self",
    category: "Order Issues",
    subcategory: "Damaged Product",
    subSubcategory: "Transit Damage",
    status: "Open",
    priority: "High",
    description: "Received 2 units of Samsung TV with cracked screens. Packaging was severely damaged.",
    createdAt: "2024-12-20T10:30:00",
    updatedAt: "2024-12-20T14:15:00",
    orderId: "BB67BDC1E80E074386E2",
    productName: "Samsung 55\" Crystal 4K UHD TV",
    assignedTo: "Logistics Support",
    timeline: [
      { id: "1", type: "created", description: "Ticket created by retailer", timestamp: "2024-12-20T10:30:00", actor: "Retailer" },
      { id: "2", type: "assigned", description: "Assigned to Logistics Support", timestamp: "2024-12-20T10:35:00", actor: "System" },
      { id: "3", type: "comment", description: "Photos of damaged packaging reviewed. Escalating to warehouse.", timestamp: "2024-12-20T14:15:00", actor: "Logistics Support" },
    ],
  },
  {
    id: "TKT-S-002",
    type: "self",
    category: "Billing & Payments",
    subcategory: "Invoice Discrepancy",
    subSubcategory: "Amount Mismatch",
    status: "In Progress",
    priority: "Medium",
    description: "Invoice shows ₹42,999 per unit but agreed price was ₹40,999 per unit for Samsung TVs.",
    createdAt: "2024-12-19T09:00:00",
    updatedAt: "2024-12-21T11:00:00",
    orderId: "BB67BDC1E80E074386E2",
    assignedTo: "Finance Team",
    timeline: [
      { id: "1", type: "created", description: "Ticket created", timestamp: "2024-12-19T09:00:00", actor: "Retailer" },
      { id: "2", type: "status_change", description: "Status changed to In Progress", timestamp: "2024-12-20T10:00:00", actor: "Finance Team" },
      { id: "3", type: "comment", description: "Checking with sales team for agreed pricing", timestamp: "2024-12-21T11:00:00", actor: "Finance Team" },
    ],
  },
  {
    id: "TKT-S-003",
    type: "self",
    category: "Delivery Issues",
    subcategory: "Delayed Delivery",
    subSubcategory: "Beyond ETA",
    status: "Resolved",
    priority: "Low",
    description: "Shipment SHP-001823-A was supposed to arrive by Dec 18 but still showing in transit.",
    createdAt: "2024-12-18T16:00:00",
    updatedAt: "2024-12-22T09:00:00",
    orderId: "BB65D874790EF3D651A0",
    assignedTo: "Logistics Support",
    timeline: [
      { id: "1", type: "created", description: "Ticket created", timestamp: "2024-12-18T16:00:00", actor: "Retailer" },
      { id: "2", type: "comment", description: "Shipment delayed due to weather. New ETA: Dec 22", timestamp: "2024-12-19T10:00:00", actor: "Logistics Support" },
      { id: "3", type: "status_change", description: "Delivered. Ticket resolved.", timestamp: "2024-12-22T09:00:00", actor: "System" },
    ],
  },
];

export const mockCustomerTickets: Ticket[] = [
  {
    id: "TKT-C-001",
    type: "customer",
    category: "Installation",
    subcategory: "New Installation",
    subSubcategory: "Standard",
    status: "Open",
    priority: "High",
    description: "Customer needs installation of Samsung 55\" TV purchased from our store.",
    createdAt: "2024-12-21T11:00:00",
    updatedAt: "2024-12-21T11:00:00",
    customerName: "Rajesh Kumar",
    customerMobile: "9876543210",
    productName: "Samsung 55\" Crystal 4K UHD TV",
    serialNumber: "ag29jdba90",
    assignedTo: "Installation Team",
    timeline: [
      { id: "1", type: "created", description: "Installation request raised by retailer", timestamp: "2024-12-21T11:00:00", actor: "Retailer" },
    ],
  },
  {
    id: "TKT-C-002",
    type: "customer",
    category: "Repair & Service",
    subcategory: "Product Not Working",
    subSubcategory: "Performance Issue",
    status: "In Progress",
    priority: "Medium",
    description: "AC not cooling properly after 2 months of installation. Customer reports warm air.",
    createdAt: "2024-12-19T14:00:00",
    updatedAt: "2024-12-21T16:00:00",
    customerName: "Priya Sharma",
    customerMobile: "9876543211",
    productName: "LG 1.5 Ton 5 Star Split AC",
    serialNumber: "ay49jaba91",
    assignedTo: "Technical Support",
    timeline: [
      { id: "1", type: "created", description: "Service request raised", timestamp: "2024-12-19T14:00:00", actor: "Retailer" },
      { id: "2", type: "assigned", description: "Assigned to technician Suresh K.", timestamp: "2024-12-20T09:00:00", actor: "Technical Support" },
      { id: "3", type: "comment", description: "Technician visit scheduled for Dec 22", timestamp: "2024-12-21T16:00:00", actor: "Technical Support" },
    ],
  },
  {
    id: "TKT-C-003",
    type: "customer",
    category: "Complaint Against Service",
    subcategory: "Service Quality",
    subSubcategory: "Issue Not Resolved",
    status: "Awaiting Info",
    priority: "High",
    description: "Previous technician visit did not resolve the refrigerator cooling issue. Customer demanding re-visit.",
    createdAt: "2024-12-18T10:00:00",
    updatedAt: "2024-12-20T15:00:00",
    customerName: "Amit Singh",
    customerMobile: "9876543212",
    productName: "Whirlpool 245L Frost Free Refrigerator",
    serialNumber: "ag29jhda92",
    assignedTo: "Appliance Support",
    timeline: [
      { id: "1", type: "created", description: "Complaint raised against previous service", timestamp: "2024-12-18T10:00:00", actor: "Retailer" },
      { id: "2", type: "comment", description: "Requesting photos of the issue", timestamp: "2024-12-19T11:00:00", actor: "Appliance Support" },
      { id: "3", type: "status_change", description: "Awaiting customer response with photos", timestamp: "2024-12-20T15:00:00", actor: "Appliance Support" },
    ],
  },
];

export const mockCustomers: Customer[] = [
  {
    id: "CUST-001",
    name: "Rajesh Kumar",
    mobile: "9876543210",
    email: "rajesh.kumar@email.com",
    address: "42, MG Road, Sector 15",
    city: "Gurugram",
    pincode: "122001",
    createdAt: "2024-10-15",
    purchases: [
      { id: "P-001", orderId: "BB67BDC1E80E074386E2", productName: "Samsung 55\" Crystal 4K UHD TV", serialNumber: "ag29jdba90", purchaseDate: "2024-12-15", warrantyExpiry: "2025-12-15", warrantyStatus: "Active", installationDate: undefined, installationStatus: "Pending" },
    ],
    tickets: [mockCustomerTickets[0]],
  },
  {
    id: "CUST-002",
    name: "Priya Sharma",
    mobile: "9876543211",
    email: "priya.s@email.com",
    address: "B-12, Green Park Extension",
    city: "New Delhi",
    pincode: "110016",
    createdAt: "2024-09-20",
    purchases: [
      { id: "P-002", orderId: "BB67BDC1E80E074386E2", productName: "LG 1.5 Ton 5 Star Split AC", serialNumber: "ay49jaba91", purchaseDate: "2024-12-15", warrantyExpiry: "2025-12-15", warrantyStatus: "Active", installationDate: "2024-12-20", installationStatus: "Completed" },
    ],
    tickets: [mockCustomerTickets[1]],
  },
  {
    id: "CUST-003",
    name: "Amit Singh",
    mobile: "9876543212",
    email: "amit.singh@email.com",
    address: "15, Civil Lines",
    city: "Jaipur",
    pincode: "302001",
    createdAt: "2024-08-10",
    purchases: [
      { id: "P-003", orderId: "BB67BDC1E80E074386E2", productName: "Whirlpool 245L Frost Free Refrigerator", serialNumber: "ag29jhda92", purchaseDate: "2024-12-05", warrantyExpiry: "2025-12-05", warrantyStatus: "Active", installationDate: "2024-12-10", installationStatus: "Completed" },
    ],
    tickets: [mockCustomerTickets[2]],
  },
];
