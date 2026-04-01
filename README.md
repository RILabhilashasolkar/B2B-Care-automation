# JMD B2B Care Automation — Retailer Portal Prototype

**JioMart Digital · B2B Help Section Module · UI Prototype**

## 🔗 Live Prototype (View in Browser)

> **https://rilabhilashasolkar.github.io/B2B-Care-automation/**

Share this link with your team — no login, no install needed. Opens directly in the browser as a mobile phone frame UI.

---

## 📱 What's Inside — 14 Screens

| Screen | Path | Description |
|--------|------|-------------|
| Dashboard | `/` | KPI cards (double-tap for drill-down), quick actions, activity feed |
| My Sales Orders | `/orders` | B2B orders with 7-filter bottom sheet, real order IDs |
| Order Detail | `/orders/:id` | Shipments, item actions, installation / service link modals |
| Item Detail | `/orders/:id/item/:id` | Per-item product info, SO tracking |
| Help Center | `/help` | Hero banner, 8 category grid, FAQ shortcuts, live chat CTA |
| FAQ | `/faq` | Search + accordion + thumbs up/down + raise ticket fallback |
| Live Chat | `/chat` | Bot UI, quick reply chips, typing indicator |
| My Tickets (Self) | `/service/self` | Status filters, priority stats, ticket list |
| Raise Ticket | `/service/self/create` | 3-step wizard: category → details → review |
| Customer Hub | `/service/customer` | Mobile/serial search, all tickets & installations |
| Customer Profile | `/service/customer/:id` | Purchase history, warranty, ticket history |
| Ticket Detail | `/ticket/:id` | Timeline, comments, escalation |
| SO Lookup | `/service/lookup` | Service order status progress bar |
| My Business | `/my-business` | Profile, GSTIN, stats, settings menu |

---

## 🎨 Design System

- **Primary colour**: JMD Blue `hsl(231, 60%, 44%)`
- **Font**: Plus Jakarta Sans (Google Fonts)
- **Phone frame**: 390×844px with live status bar & home indicator
- **Stack**: Vite + TypeScript + React + Tailwind CSS v3 + React Router v6

---

## 💻 Run Locally

```bash
git clone https://github.com/RILabhilashasolkar/B2B-Care-automation.git
cd B2B-Care-automation
npm install
npm run dev
```
Opens at **http://localhost:5173**

---

## 📊 Real B2B Data Used

- **Order IDs**: `BB67BDC1E80E074386E2` · `BB65D874790EF3D651A0` · `BB661A2B220E87559DA6`
- **Ticket volume**: 4,760 B2B tickets from Kapture CRM
  - Demo & Installation: 2,113 (44%)
  - Repair & Service: 1,045 (22%)
  - Billing & Payments: 284 (6%)
  - Delivery Issues: 83 (2%)

---

*Built by Abhilash Asolkar · Senior PM, JioMart Digital*
