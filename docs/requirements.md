# Product Requirements Document (PRD)
# Kitchen POS & Restaurant Management System

**Version:** 1.0  
**Last Updated:** March 12, 2025  
**Status:** Draft

---

## 1. Overview

### 1.1 Product Summary

A lightweight, affordable **Kitchen POS & Restaurant Management System** that digitizes order taking, billing, and kitchen operations. The system is designed to work reliably in environments with poor or intermittent internet by prioritizing **offline-first** behavior: data is stored locally and synced when connectivity is restored.

### 1.2 Vision

To make professional-grade POS and kitchen management accessible to every restaurant and kitchen—simple to use, low-cost, and resilient to connectivity issues.

---

## 2. Problem Statement

### 2.1 Current State

- **Low digital adoption:** Many restaurants still rely on paper notebooks and manual record-keeping for orders, inventory, and daily sales.
- **Barriers to existing solutions:** Restaurant management systems in the market are often:
  - **Complex** — steep learning curve and feature bloat.
  - **Expensive** — subscription and hardware costs are prohibitive for small and mid-sized outlets.
- **Connectivity dependency:** Solutions that require constant internet fail in areas with unreliable or interrupted connectivity, causing downtime and lost orders.

### 2.2 Impact

- Inefficient order flow, higher risk of errors, and difficulty in tracking sales and inventory.
- Small businesses cannot justify the cost of enterprise POS systems.
- Interruptions in service when the internet drops.

### 2.3 Solution

This application will:

- Provide a **simple, affordable** POS and kitchen management experience.
- **Run fully offline** — save all data locally (e.g., in a file or local DB on the device) and **sync automatically** when the internet is available.
- Cover core workflows: **menu display, order placement (drag-and-drop), advanced POS, billing, and KOT (Kitchen Order Ticket) generation.**

---

## 3. Users

| User Type          | Description                                                                 | Primary Needs                                                |
|--------------------|-----------------------------------------------------------------------------|--------------------------------------------------------------|
| **Business Owners**| Restaurant/kitchen owners who need oversight and reporting                 | Sales summary, daily reports, cost control, simple setup     |
| **Staff**          | Waitstaff, cashiers, and kitchen staff who operate the system daily        | Fast order entry, clear KOTs, reliable billing, offline use    |

---

## 4. Goals & Success Metrics

### 4.1 Goals

1. **Usability:** Staff can place and manage orders with minimal training (e.g., drag-and-drop order building).
2. **Reliability:** Zero data loss and continued operation during internet outages.
3. **Affordability:** Lower total cost of ownership than typical restaurant management systems.
4. **Completeness:** Full cycle from order → kitchen ticket → bill generation in one system.

### 4.2 Success Metrics (Examples)

- Orders and bills can be created and printed without internet.
- Data syncs to the server when connection is restored with no manual intervention.
- Time to create an order and generate a bill under a defined threshold (e.g., &lt; 2 minutes).
- Positive feedback from business owners and staff on ease of use and stability.

---

## 5. Core Features

### 5.1 Display Food Items & Drag-and-Drop Order Building

**Description:**  
The UI shows the available food items (menu). Users build a customer order by **dragging and dropping** items (or item tiles) into an **order container** (e.g., basket/cart for a table or takeaway).

**User Story:**  
As a staff member, I can see all food items on screen and drag them into an order container so that I can quickly build customer orders without typing.

**Acceptance Criteria:**

- [ ] Menu/food items are displayed in a clear, browsable layout (e.g., grid or list).
- [ ] Items can be categorized (e.g., starters, mains, beverages).
- [ ] User can **drag** a food item and **drop** it into a designated order container.
- [ ] Order container shows added items with quantity and optional modifiers (e.g., size, notes).
- [ ] User can adjust quantity and remove items from the order container.
- [ ] Works in offline mode; menu and order state are available from local storage.

---

### 5.2 Offline-First & Local Sync

**Description:**  
The app continues to function when the internet is interrupted. All critical data (orders, bills, menu, etc.) is **saved locally on the device** (e.g., local file or IndexedDB/SQLite). When the connection is restored, the app **syncs** local changes to the server and pulls any server-side updates.

**User Story:**  
As a business owner or staff member, I want the app to work without internet and sync automatically when the connection is back so that we never lose orders or stop service.

**Acceptance Criteria:**

- [ ] App runs and allows full order creation, editing, and bill/KOT generation when offline.
- [ ] Data is persisted locally (e.g., file or local DB) on the device.
- [ ] When internet is available, the app syncs:
  - [ ] Pending orders and bills to the server.
  - [ ] Menu and configuration updates from the server (if applicable).
- [ ] Sync is automatic; no mandatory manual “Sync” action for normal operation.
- [ ] Conflicts (e.g., same order edited on two devices) are handled with a defined strategy (e.g., last-write-wins or merge rules).
- [ ] User is informed of sync status (e.g., “Synced” / “Offline – will sync when online”).

---

### 5.3 Advanced POS System

**Description:**  
A full point-of-sale experience: manage tables/sessions, apply discounts, taxes, multiple payment methods, and support for different order types (dine-in, takeaway, delivery).

**User Story:**  
As a staff member, I need a complete POS so that I can process payments, apply discounts and taxes, and manage different order types in one place.

**Acceptance Criteria:**

- [ ] Support for **order types:** Dine-in (with table/session), takeaway, delivery.
- [ ] **Payment methods:** Cash, card, UPI, split payments.
- [ ] **Discounts:** Percentage or fixed amount; optional reason/approval for audit.
- [ ] **Tax:** Configurable tax rates applied to bills.
- [ ] **Tender:** Enter amount tendered and calculate change.
- [ ] **Transaction history:** View and search past transactions (from local store when offline, from server when online).
- [ ] All POS actions work offline and sync when connected.

---

### 5.4 Bill Generation & KOT (Kitchen Order Ticket) Generation

**Description:**  
Generate **bills** for customers (with itemized list, taxes, discounts, total) and **KOTs (Kitchen Order Tickets)** that the kitchen uses to prepare orders. Optionally support printing or digital display.

**User Story:**  
As staff, I need to generate a bill for the customer and a KOT for the kitchen so that payment and preparation are clear and traceable.

**Acceptance Criteria:**

**Bill Generation:**

- [ ] Bill includes: item name, quantity, unit price, subtotal, discounts, taxes, grand total.
- [ ] Bill can be printed or exported (e.g., PDF).
- [ ] Bill is stored locally when offline and synced when online.
- [ ] Option to reprint or view past bills.

**KOT Generation:**

- [ ] KOT is generated when an order is confirmed (before or at payment).
- [ ] KOT includes: table/session identifier, order items, quantity, special instructions (e.g., “no onion”), timestamp.
- [ ] KOT can be printed for the kitchen or displayed on a kitchen display (if in scope).
- [ ] KOTs are stored and synced like orders; kitchen can work from local KOTs when offline.

---

## 6. Technical Stack

| Layer       | Technology   | Purpose / Notes                                      |
|------------|--------------|------------------------------------------------------|
| **Frontend** | Next.js      | UI, SSR/SSG if needed, client-side state and offline |
| **Backend**  | Express.js   | REST (or hybrid) API, business logic, sync endpoint  |
| **Database** | MongoDB      | Persistent store for menu, orders, bills, users       |
| **Cache / Queue** | Redis   | Session, sync queue, real-time updates, rate limiting |

### 6.1 Offline & Sync (High-Level)

- **Client:** Local persistence (e.g., IndexedDB, local file, or SQLite via WASM) for menu, orders, bills, and pending sync queue.
- **Sync:** When online, client sends pending mutations to Express API; server applies them to MongoDB. Optionally use Redis for sync job queue or pub/sub for multi-device updates.
- **Conflict handling:** Define rules (e.g., last-write-wins per resource or merge for specific entities) and document in technical design.

---

## 7. Non-Functional Requirements

### 7.1 Performance

- Order and bill creation should feel instant on the device (sub-second response from local storage).
- Sync should complete in the background without blocking the UI.

### 7.2 Reliability

- No loss of orders or bills due to app closure or network drop, as long as data is written to local storage.
- Clear indication of offline vs online and sync status.

### 7.3 Security

- Authentication for staff and owners (e.g., login and role-based access).
- Sensitive data (e.g., payment info) handled according to best practices; no card data stored unless compliant with PCI scope.
- API and sync endpoints protected (auth tokens, HTTPS).

### 7.4 Usability

- Simple, minimal training required for daily operations.
- Accessible on typical devices used in restaurants (tablets, desktops).

---

## 8. Out of Scope (V1)

- Full inventory and procurement module.
- Payroll and HR.
- Multi-location franchise management.
- Native mobile apps (V1 can be web/PWA only).

*(Adjust based on actual V1 scope.)*

---

## 9. Future Considerations (Post–V1)

- Kitchen display system (KDS) for order status and bumping.
- Basic inventory (stock levels, low-stock alerts).
- Reports and analytics (sales by day, top items, etc.).
- PWA install and optional print service for thermal printers.
- Multi-outlet support with centralized menu and reporting.

---

## 10. Document History

| Version | Date       | Author / Notes        |
|---------|------------|------------------------|
| 1.0     | 2025-03-12 | Initial PRD draft     |

---

*This PRD should be updated as the product evolves. Technical design (sync protocol, data models, API contracts) can be captured in a separate technical spec (e.g., `docs/technical-spec.md`).*
