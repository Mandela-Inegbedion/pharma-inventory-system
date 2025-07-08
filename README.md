# Pharmaceutical Wholesale DSS + IMS System

A secure, scalable, and data-driven **Decision Support System (DSS)** integrated with an **Inventory Management System (IMS)** for pharmaceutical wholesalers.

This system enables:
- Product & inventory tracking
- Supplier & sales management
- Automated reorder suggestions
- Data-driven analytics & reports

---

## Core Modules & Features

### 1. User Authentication & Role-Based Access
- JWT-secured login (no public registration)
- Role-based dashboards:
  - **Admin**: Manages users & system settings
  - **Inventory Manager**: Handles inventory and suppliers
  - **Sales Clerk**: Records sales only

### 2. Supplier Management
- CRUD operations for suppliers
- View performance metrics (linked to delivery/sales)
- `Route: /suppliers`

### 3. Inventory Management
- Add/edit/delete inventory items
- Track quantities, expiry dates, and reorder levels
- Auto-deduct stock on sale
- Alerts for low stock or upcoming expiry

### 4. Sales Management
- Record product sales
- Auto-update inventory
- Filter sales history by date or product

### 5. Decision Support System (DSS)
- Reports with charts:
  - Monthly Sales
  - Low Stock
  - Reorder Suggestions
  - Supplier Performance
- Filters: Date range, product
- Visuals via **Chart.js** or **Recharts**

### 6. Reports & Exports
- Daily/Weekly/Monthly reporting
- Export data to **CSV** or **PDF**
- Display key performance metrics (cost, revenue, profit)

---

## Database Schema (PostgreSQL)

```sql
Users      (id, username, password, role)
Products   (id, name, quantity, expiry_date, reorder_level)
Suppliers  (id, name, contact_person, phone, email)
Sales      (id, product_id, quantity, date_sold)
Orders     (id, product_id, quantity_ordered, status)
