# 📦 SwiftCart Order Tracking Experience

A modern, responsive, mobile-first e-commerce Order Tracking screen built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**.

Designed to replace ambiguous, 4-stage tracking screens with an immediately understandable, context-aware delivery tracking interface that reassures customers and provides direct resolution paths.

---

## 🚀 Live Demo & Repository
- **GitHub Repository**: [https://github.com/Khandaker20201125010/order-tracking](https://github.com/Khandaker20201125010/order-tracking)
- **Live Deployment URL**: Deployable with one click to Vercel (see Deployment section below).

---

## 🌟 Key Features

1. **Clear Delivery Progress & Timeline**:
   - High-level progress stepper for at-a-glance scanning of overall journey.
   - Chronological carrier milestone history with timestamps, hub locations, and scan notes.
   - Distinct icons and colors for completed, current, and upcoming stages.
   - Expandable milestone event log with seamless collapse/expand controls.

2. **Context-Aware Current Order Status**:
   - Reassuring, human-friendly status headlines explaining what is happening right now.
   - Carrier badge, tracking number with one-tap clipboard copy, and carrier website integration.
   - Realistic "Refresh Tracking" action with feedback animations.

3. **Prominent Estimated Delivery Date/Time**:
   - Prominently styled delivery estimate card.
   - Strikethrough of expired estimate dates and clear callouts for updated schedules.

4. **Detailed Order & Product Summary**:
   - Compact item preview with product thumbnails, variants, SKUs, and quantities.
   - Expandable drawer revealing shipping destination, courier delivery instructions, and full financial receipt breakdown.

5. **Direct Problem Resolution & Support**:
   - **Issue Resolution Modal**: Allows reporting delayed, missing, or damaged orders, selecting preferred resolutions (replacement or refund), and generating an immediate incident reference claim code with a 2-hour SLA.
   - **Customer Support Concierge**: Features an interactive AI assistant (*SwiftBot*) with smart prompt replies, priority phone support (`1-800-555-0192`), and delivery FAQs.

6. **Mobile-First Responsive Design (360px – 430px)**:
   - Optimized specifically for mobile viewports (360px, 375px, 390px, 430px) with responsive fluid scaling and zero horizontal overflow.
   - Desktop view includes a dedicated device viewport width simulator so evaluators can inspect on any screen size.

---

## 🎯 How to View the Three Required Order States

An **Evaluator Demo Bar** is built right into the top of the interface, allowing one-click switching between the three required order states:

### 1. State A: Delayed Order
- **Scenario**: Original delivery window has passed due to unexpected transit events.
- **Visual Distinction**: Warm amber accent theme (`border-amber-200`, `bg-amber-500`).
- **Context Provided**:
  - Clear explanation: *"Shipment delayed in transit due to severe weather"*.
  - Strikethrough of original passed delivery estimate (`Wednesday, Sep 24, 2026`).
  - Prominent updated estimate (`Saturday, Sep 27, 2026 by 6:00 PM`).
  - Logistics note explaining the safety reroute at the Waco transit hub.
  - Action buttons to report delay concerns or subscribe to SMS updates.

### 2. State B: Delivered but Not Received
- **Scenario**: Carrier marked the order as delivered, but the customer cannot locate it.
- **Visual Distinction**: Coral/rose alert theme (`border-rose-200`, `bg-rose-600`).
- **Context Provided**:
  - Displays carrier drop-off location note: *"Front Door / Porch (Near Planter) • Placed safely behind decorative planter box on covered porch"*.
  - Expandable checklist: checks for secondary locations, building front desks, and driver pre-scans.
  - Urgent primary CTA: **"I Didn't Receive This Order"** which opens an interactive claim flow allowing instant selection of an expedited replacement or full refund, returning a verified tracking claim ticket code (e.g. `#CLM-177916`).

### 3. State C: Tracking Not Available Yet
- **Scenario**: Order confirmed and payment authorized, but carrier pickup barcode has not yet scanned.
- **Visual Distinction**: Elegant indigo theme (`border-indigo-200`, `bg-indigo-600`).
- **Context Provided**:
  - Clear explanation that the order is being assembled and packed at the Seattle fulfillment hub.
  - Expected live tracking availability window: *"Estimated live tracking: Today by 8:00 PM PST"*.
  - Preserves full order details, delivery address, and payment confirmation.
  - Interactive "Refresh Tracking Status" and live support options.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **UI & Styling**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: Geist Sans & Geist Mono via `next/font`

---

## 📁 Project Architecture

```
src/
├── app/
│   ├── components/
│   │   └── order-tracking/
│   │       ├── OrderTracking.tsx     # Coordinator screen, demo controls & layout shell
│   │       ├── StatusCard.tsx        # Dynamic status banner, delivery estimate & carrier bar
│   │       ├── TrackingTimeline.tsx  # Horizontal progress bar & milestone event log
│   │       ├── OrderSummary.tsx      # Compact product items, shipping address & price breakdown
│   │       ├── IssueReport.tsx       # Interactive missing/delayed order resolution modal
│   │       └── SupportSheet.tsx      # Support drawer with live chat, phone channels & FAQs
│   ├── globals.css                   # Global Tailwind CSS tokens, scrollbar & keyframes
│   ├── layout.tsx                    # Root layout with metadata and font configurations
│   └── page.tsx                      # Main entry page rendering OrderTracking
├── data/
│   └── orders.ts                     # Rich mock datasets for States A, B, and C
└── types/
    └── order.ts                      # Strict TypeScript interfaces and data models
```

---

## 💻 Local Development Setup

### Prerequisites
- Node.js 18.18+ or Node.js 20+
- npm (or pnpm / yarn)

### Installation
```bash
# Clone the repository
git clone https://github.com/Khandaker20201125010/order-tracking.git

# Navigate to project directory
cd order-tracking

# Install dependencies
npm install
```

### Running Locally
```bash
# Start the development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
# Build production bundle
npm run build

# Start production server
npm run start
```

---

## 🌐 Deployment to Vercel

This repository is optimized for zero-config deployment on Vercel:

1. Push your changes to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete order tracking screen with 3 states"
   git push origin main
   ```
2. Log in to [Vercel](https://vercel.com).
3. Click **Add New...** -> **Project** -> Import the `order-tracking` repository.
4. Keep standard Next.js build settings (`npm run build`).
5. Click **Deploy**. Vercel will build and assign an active production URL.

Alternatively, deploy directly via the Vercel CLI:
```bash
npx vercel
```
